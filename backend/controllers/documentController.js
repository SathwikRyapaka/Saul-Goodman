const pdf = require('pdf-parse');
const Document = require('../models/Document');
const { parseDocument } = require('../services/documentParser');
const { extractTextViaOCR, generateCaseSummary } = require('../services/geminiService');

exports.uploadAndProcess = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a valid PDF document." });
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    // Create a new document in MongoDB with 'extracting' status
    const docRecord = new Document({
      fileName,
      processingStatus: 'extracting'
    });
    await docRecord.save();

    // Fire off async processing so we can return ID immediately, or we can await it.
    // The user flow implies we return ID and the frontend polls, but awaiting is easier for a simple prototype.
    // Since the spec says "Return document ID. Then GET /summary", we will do it synchronously to ensure the data is there when they call GET, or handle it async.
    // Let's do it synchronously for reliability in this demo, but update status as we go.
    
    let rawText = '';
    try {
      const pdfData = await pdf(fileBuffer);
      rawText = pdfData.text;
      
      // OCR Fallback if text is too short (scanned PDF)
      if (!rawText || rawText.trim().length < 50) {
        docRecord.processingStatus = 'ocr_processing';
        await docRecord.save();
        const base64 = fileBuffer.toString('base64');
        rawText = await extractTextViaOCR(base64, req.file.mimetype);
      }
    } catch (err) {
      console.log("PDF parse failed, attempting OCR fallback");
      docRecord.processingStatus = 'ocr_processing';
      await docRecord.save();
      const base64 = fileBuffer.toString('base64');
      rawText = await extractTextViaOCR(base64, req.file.mimetype);
    }

    if (!rawText || rawText.trim().length === 0) {
      docRecord.processingStatus = 'failed';
      await docRecord.save();
      return res.status(422).json({ error: "Unable to extract readable content from this document." });
    }

    docRecord.rawText = rawText;
    docRecord.processingStatus = 'analyzing';
    await docRecord.save();

    // Parse the raw text into structured JSON
    const structuredData = parseDocument(rawText);
    docRecord.structuredCaseData = structuredData;
    await docRecord.save();

    // Call Gemini AI
    try {
      const aiSummary = await generateCaseSummary(structuredData, rawText);
      
      // Override brittle regex extraction with highly accurate AI extraction
      if (aiSummary.parties) docRecord.structuredCaseData.parties = aiSummary.parties;
      if (aiSummary.caseHistory) docRecord.structuredCaseData.caseHistory = aiSummary.caseHistory;
      if (aiSummary.actsAndSections) docRecord.structuredCaseData.actsAndSections = aiSummary.actsAndSections;

      docRecord.aiSummary = aiSummary;
      docRecord.processingStatus = 'completed';
      await docRecord.save();
    } catch (aiErr) {
      console.error("AI Summarization Error:", aiErr);
      docRecord.processingStatus = 'failed';
      await docRecord.save();
      return res.status(503).json({ error: "Document was successfully read, but the summary service is temporarily unavailable." });
    }

    res.json({ success: true, documentId: docRecord._id });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "An unexpected error occurred during processing." });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
