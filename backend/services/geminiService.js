const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.extractTextViaOCR = async (base64Data, mimeType) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("Missing Gemini API Key");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = "Please perform OCR on this document and return strictly the raw text contents. Do not summarize, just extract the text exactly as written.";
  const parts = [
    { text: prompt },
    { inlineData: { mimeType: mimeType || "application/pdf", data: base64Data } }
  ];

  const result = await model.generateContent(parts);
  return result.response.text();
};

exports.generateCaseSummary = async (structuredData, rawText) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("Missing Gemini API Key");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a court-document information assistant.
Use ONLY the information provided in the court record.
Do not invent facts. Do not predict the outcome of a case. Do not provide legal advice.
Explain the information in simple language for an ordinary citizen.

Here is the raw text from the document:
${rawText.substring(0, 50000)}

And here is the parsed structured data:
${JSON.stringify(structuredData)}

Return exactly a JSON object matching this structure:
{
  "caseSummary": "Simple explanation of what this case is about",
  "caseStatus": "The exact case status",
  "currentStage": "The exact current stage",
  "importantDates": [{"label": "Filing Date", "date": "..."}],
  "parties": {"petitioner": [], "respondent": []},
  "importantProceedings": ["..."],
  "disposalDetails": "...",
  "actsAndSections": ["..."],
  "simpleEnglishExplanation": "...",
  "teluguExplanation": "...",
  "importantPoints": ["..."]
}

Do not include markdown \`\`\`json blocks, just the pure JSON.`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();
  
  if (text.startsWith('\`\`\`json')) text = text.replace(/^\`\`\`json/, '');
  if (text.startsWith('\`\`\`')) text = text.replace(/^\`\`\`/, '');
  if (text.endsWith('\`\`\`')) text = text.replace(/\`\`\`$/, '');
  
  return JSON.parse(text.trim());
};
