import { mockDocuments } from '../data/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getDocuments = async () => {
  await delay(500);
  return mockDocuments;
};

export const uploadDocument = async (file) => {
  // Placeholder for POST /api/documents/upload
  await delay(1000);
  return { success: true, message: "Document uploaded successfully", docId: Date.now() };
};

export const summarizeDocument = async (doc) => {
  // Placeholder for POST /api/documents/:id/summarize
  await delay(2000);
  
  const docName = doc?.name || "Document";
  const docType = doc?.type || "Legal Document";
  const caseNum = doc?.caseNumber || "N/A";
  const dateStr = doc?.date ? new Date(doc.date).toLocaleDateString() : new Date().toLocaleDateString();

  return {
    documentType: docType,
    caseNumber: caseNum,
    orderDate: dateStr,
    currentStage: "Review",
    summary: `This is an AI-generated summary for the document "${docName}". This document appears to be related to your case proceedings. Based on a quick analysis, it outlines key facts and statements that will be relevant for your upcoming hearings. Please ensure you maintain a physical copy of this for your records.`,
    importantEvents: ["Document submitted for AI Review", "Ready for court reference"],
    importantDates: [`${dateStr} - Document Processed`],
    keyPoints: [
      `Main subject pertains to ${docName}`,
      "Ensure all original copies are preserved.",
      "Consult with your legal counsel regarding these facts."
    ],
    nextListedProceeding: "Pending review by counsel"
  };
};
