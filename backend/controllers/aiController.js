const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.processVoiceQuery = async (req, res) => {
  try {
    const { query } = req.body;
    
    // If no API key is provided, return a fallback message
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      return res.json({ 
        response: "I am ready to help! However, the developer has not added the Gemini API key to the backend .env file yet. Please add your API key to proceed." 
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const systemPrompt = `You are 'Nyaya Setu', an expert legal AI assistant designed to help citizens understand their legal cases. 
    Keep your answers highly concise, empathetic, and professional, as they will be read aloud via text-to-speech.
    Respond in 1 to 3 short sentences. 
    User query: ${query}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (err) {
    console.error('AI Processing Error:', err);
    res.status(500).json({ response: "I'm sorry, I encountered an error while processing your request. Please try again." });
  }
};

exports.summarizeDocument = async (req, res) => {
  try {
    const { base64Data, mimeType, fileName } = req.body;
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      return res.status(400).json({ error: "Gemini API key is missing. Please add it to the .env file." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `Analyze this legal document named "${fileName}". Provide a highly structured JSON response with the following keys exactly:
    - "documentType": A short classification of the document (e.g. "Court Order", "Petition", "Affidavit").
    - "caseNumber": The case number if found, otherwise "N/A".
    - "orderDate": The date of the document if found, otherwise today's date.
    - "currentStage": The current legal stage implied by the document.
    - "summary": A detailed but concise 3-4 sentence summary of the document's contents.
    - "importantEvents": An array of 2-3 important events mentioned in the document.
    - "importantDates": An array of 2-3 important dates mentioned in the document.
    - "keyPoints": An array of 3-4 critical bullet points a lawyer would want to know.
    - "nextListedProceeding": The next action or proceeding required, if any.
    
    Return ONLY valid JSON. Do not include markdown code block formatting like \`\`\`json.`;

    const parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: mimeType || "application/pdf",
          data: base64Data
        }
      }
    ];

    const result = await model.generateContent(parts);
    const response = await result.response;
    let text = response.text().trim();
    
    // Strip markdown formatting if the model still includes it
    if (text.startsWith('\`\`\`json')) text = text.replace(/^\`\`\`json/, '');
    if (text.startsWith('\`\`\`')) text = text.replace(/^\`\`\`/, '');
    if (text.endsWith('\`\`\`')) text = text.replace(/\`\`\`$/, '');
    
    const parsedJson = JSON.parse(text.trim());
    res.json(parsedJson);

  } catch (err) {
    console.error('AI Summarization Error:', err);
    res.status(500).json({ error: "Failed to summarize the document." });
  }
};

const Case = require('../models/Case');
const mongoose = require('mongoose');
const { authorizeCaseAccess } = require('../utils/authUtils');

exports.explainMongoDB_Case = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid case ID format' });
    }

    const caseData = await Case.findById(id);
    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (!authorizeCaseAccess(caseData, req.user.name)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      return res.status(400).json({ success: false, message: "Gemini API key is missing. Please add it to the .env file." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const systemPrompt = `You are an expert legal assistant for the Nyaya Setu application. 
Your job is to explain the provided MongoDB case record to an ordinary citizen who has little or no knowledge of legal terminology.

CRITICAL RULES:
1. NEVER invent facts, allegations, evidence, arguments, judgments, reasons, legal claims, future hearing outcomes, case outcome, names, dates, sections, or events.
2. If information is missing, explicitly say: "Not available in the case record." or "The available case data does not provide this information."
3. Use extremely simple English. Avoid complicated legal terminology.
4. If a legal term is necessary, explain it immediately in simple words (e.g., "Petitioner means the person who filed the case").
5. Do not give legal advice. Do not predict the result of the case. Do not predict what the court will do next.

Here is the RAW Case JSON from MongoDB:
${JSON.stringify(caseData, null, 2)}

Provide a highly structured JSON response EXACTLY matching this format (no markdown blocks like \`\`\`json):
{
  "success": true,
  "case_id": "${caseData._id.toString()}",
  "explanation": {
    "case_overview": "Short, simple explanation of what can be understood. If unknown say 'The available case information does not provide enough details...'",
    "people_involved": "Explain who petitioner and respondents are in simple language based on the data.",
    "court_information": "Explain where the case is being heard based on state, district, complex, court_name.",
    "case_type": "The case type (e.g., OS) and a simple definition.",
    "case_identifiers": "Explain what Case Number, CNR, Filing Number, Registration Number mean in simple terms.",
    "filing_information": "Explain the dates (Filing, Registration, First Hearing) in an easy-to-read format.",
    "current_status": "Explain what the status '${caseData.case_status}' means.",
    "case_progress": [
      { "date": "...", "stage": "...", "description": "..." } // array derived from case_history
    ],
    "latest_update": "Explain the recorded last_order in simple language.",
    "next_step": "Explain next_hearing_date if available, else 'No next hearing date is currently available...'",
    "important_dates": [
      { "label": "Filing Date", "value": "..." } // array of key dates
    ],
    "acts_and_sections": [
      { "act": "...", "sections": "..." } // array derived from under_acts. Explain simply.
    ],
    "outcome": "Explain the outcome if disposed, or say it is currently pending."
  },
  "disclaimer": "⚠️ Disclaimer: This explanation is generated by AI from the available case record and is intended to make the information easier to understand. It is not legal advice and should not be treated as an official court interpretation."
}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Strip markdown formatting if the model still includes it
    if (text.startsWith('\`\`\`json')) text = text.replace(/^\`\`\`json/, '');
    if (text.startsWith('\`\`\`')) text = text.replace(/^\`\`\`/, '');
    if (text.endsWith('\`\`\`')) text = text.replace(/\`\`\`$/, '');
    
    const parsedJson = JSON.parse(text.trim());
    res.json(parsedJson);

  } catch (err) {
    console.error('AI Explanation Error:', err);
    res.status(500).json({ success: false, message: "Failed to explain the case. Please try again." });
  }
};

