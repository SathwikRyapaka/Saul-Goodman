const LegalService = require('../models/LegalService');
const LegalAuthority = require('../models/LegalAuthority');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.getAllServices = async (req, res) => {
  try {
    const services = await LegalService.find().select('-__v');
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getServiceByType = async (req, res) => {
  try {
    const { serviceType } = req.params;
    const service = await LegalService.findOne({ service_type: serviceType }).select('-__v');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    console.error('Error fetching service details:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.searchServices = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }
    
    // Text search using the created index
    const services = await LegalService.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).select('-__v');
    
    res.json(services);
  } catch (err) {
    console.error('Error searching services:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAuthorities = async (req, res) => {
  try {
    const { state, district } = req.query;
    let query = {};
    if (state) query.state = state;
    if (district) query.district = district;
    
    const authorities = await LegalAuthority.find(query).select('-__v');
    res.json(authorities);
  } catch (err) {
    console.error('Error fetching authorities:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.askAI = async (req, res) => {
  try {
    const { question, language = 'en' } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'AI configuration missing' });
    }

    // Fetch context from our database
    const services = await LegalService.find().select('title description faqs');
    let contextStr = 'Nyaya Setu Knowledge Base:\n';
    services.forEach(s => {
      contextStr += `Service: ${s.title}\nDescription: ${s.description}\n`;
      s.faqs.forEach(f => {
        contextStr += `Q: ${f.question} A: ${f.answer}\n`;
      });
      contextStr += '\n';
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const systemPrompt = `You are the Nyaya Setu Legal Services AI Assistant.
Your goal is to answer the citizen's question accurately using ONLY the provided Nyaya Setu Knowledge Base.

CRITICAL RULES:
1. NEVER predict court outcomes.
2. NEVER act as a lawyer or provide personalized legal advice.
3. NEVER invent government contacts, deadlines, or laws.
4. If the answer cannot be found in the Knowledge Base, reply exactly with: "I don't have enough verified information to answer that. Please check the official Legal Services Authority information."
5. Always cite the "Source: Nyaya Setu Official Knowledge Base".
6. Reply in ${language === 'te' ? 'Telugu' : 'English'}. Keep the language simple and easy to understand.

${contextStr}

Citizen's Question: ${question}`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text().trim();

    res.json({ answer: responseText });

  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ message: 'Failed to generate response' });
  }
};
