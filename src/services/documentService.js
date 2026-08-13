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

export const summarizeDocument = async (id) => {
  // Placeholder for POST /api/documents/:id/summarize
  await delay(2000);
  return {
    documentType: "Court Order",
    caseNumber: "OS/101/2025",
    orderDate: "01 Aug 2026",
    currentStage: "Evidence",
    summary: "The court has reviewed the initial filings. It is ordered that the evidence be collected.",
    importantEvents: ["Notices issued", "Evidence scheduled"],
    importantDates: ["01 Aug 2026 - Order Issued"],
    keyPoints: ["Respondent must appear for next hearing"],
    nextListedProceeding: "Evidence Collection on 20 Aug 2026"
  };
};
