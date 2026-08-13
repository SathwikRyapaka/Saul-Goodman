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

