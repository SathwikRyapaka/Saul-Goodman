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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
