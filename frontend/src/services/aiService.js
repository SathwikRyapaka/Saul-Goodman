const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const explainCase = async (caseId, language = 'en') => {
  // Placeholder for POST /api/ai/explain-case
  await delay(1500);
  return {
    caseSummary: "This is a property dispute regarding land ownership filed by Arjun Rao against Vikram Reddy. The case is currently pending in the District Court, Hyderabad.",
    currentPosition: "The case is at the 'Evidence' stage. Both parties are required to submit their supporting documents and proofs.",
    recentProceedings: "In the last hearing on 22 July 2026, supporting documents were submitted and the matter was listed for further proceedings.",
    nextHearing: "The next hearing is scheduled for 20 August 2026.",
    importantPoints: ["Ensure all original documents are carried to the next hearing.", "Your presence may be required."],
    whatThisMeans: "You are in the middle of the trial process. Gathering all necessary facts and documents is crucial at this moment."
  };
};

export const processVoiceQuery = async (query) => {
  // Placeholder for POST /api/ai/voice
  await delay(1000);
  if (query.toLowerCase().includes('hearing')) {
    return "Your next hearing is on 20 August 2026 for case OS/101/2025.";
  } else if (query.toLowerCase().includes('explain')) {
    return "Your case is currently at the Evidence stage. You need to submit your documents.";
  }
  return "I found 3 active cases for you. Would you like me to read them out?";
};
