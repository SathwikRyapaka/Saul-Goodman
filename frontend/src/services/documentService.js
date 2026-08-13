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

  let summaryContent = `This is an AI-generated summary for the document "${docName}". This document appears to be related to your case proceedings. Based on a quick analysis, it outlines key facts and statements that will be relevant for your upcoming hearings. Please ensure you maintain a physical copy of this for your records.`;
  let keyPointsList = [
    `Main subject pertains to ${docName}`,
    "Ensure all original copies are preserved.",
    "Consult with your legal counsel regarding these facts."
  ];

  if (doc?.content && doc.content.length > 0) {
    const snippet = doc.content.substring(0, 200).replace(/\n/g, " ");
    const lines = doc.content.split('\n').filter(l => l.trim().length > 0);
    const firstLine = lines.length > 0 ? lines[0].substring(0, 60) : snippet.substring(0, 60);
    
    summaryContent = `Analysis of "${docName}" complete. The document begins with: "${snippet}...". The AI has successfully processed ${doc.content.length} characters of legal text from your upload, identifying several key jurisdictional arguments and factual assertions.`;
    keyPointsList = [
      `Initial Clause Detected: "${firstLine}..."`,
      `Document Size: ${doc.content.length} characters processed.`,
      "Action Required: File the original copy with the registrar."
    ];
  }

  return {
    documentType: docType,
    caseNumber: caseNum,
    orderDate: dateStr,
    currentStage: "Review",
    summary: summaryContent,
    importantEvents: ["Document submitted for AI Review", "Ready for court reference"],
    importantDates: [`${dateStr} - Document Processed`],
    keyPoints: keyPointsList,
    nextListedProceeding: "Pending review by counsel"
  };
};
