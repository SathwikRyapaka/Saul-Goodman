function extractField(text, patterns) {
  for (const pattern of patterns) {
    const regex = new RegExp(`${pattern}\\s*[:\\-]?\\s*(.+)`, 'i');
    const match = text.match(regex);
    if (match && match[1].trim() !== '') {
      return match[1].trim();
    }
  }
  return null;
}

function parseParties(text) {
  const parties = { petitioner: [], respondent: [] };
  
  const petitionerMatches = [...text.matchAll(/(?:Petitioner|Plaintiff|Appellant|Complainant|Applicant)\s*(?:No\.?\s*\d+)?\s*[:\-]?\s*([A-Za-z\s\.]+)/gi)];
  petitionerMatches.forEach(m => parties.petitioner.push({ name: m[1].trim(), role: 'Petitioner' }));

  const respondentMatches = [...text.matchAll(/(?:Respondent|Defendant|Opposite Party)\s*(?:No\.?\s*\d+)?\s*[:\-]?\s*([A-Za-z\s\.]+)/gi)];
  respondentMatches.forEach(m => parties.respondent.push({ name: m[1].trim(), role: 'Respondent' }));

  return parties;
}

function parseHistory(text) {
  const history = [];
  // Look for dates near each other in table formats
  const dateRegex = /(\d{2}[-/\.]\d{2}[-/\.]\d{4})\s+(?:to\s+)?(\d{2}[-/\.]\d{2}[-/\.]\d{4})?/g;
  let match;
  while ((match = dateRegex.exec(text)) !== null) {
    history.push({
      businessDate: match[1],
      nextHearingDate: match[2] || null
    });
  }
  return history;
}

function parseActs(text) {
  const acts = [];
  const actRegex = /Under Act(?:\(s\))?\s*:\s*([^,]+)/gi;
  let match;
  while ((match = actRegex.exec(text)) !== null) {
    acts.push({ act: match[1].trim(), sections: [] });
  }
  return acts;
}

exports.parseDocument = (rawText) => {
  if (!rawText) return null;

  return {
    courtDetails: {
      courtName: extractField(rawText, ['Court Name', 'In the Court of', 'Before']),
      district: extractField(rawText, ['District']),
      state: extractField(rawText, ['State'])
    },
    caseDetails: {
      caseType: extractField(rawText, ['Case Type']),
      caseNumber: extractField(rawText, ['Case Number', 'Case No\\.']),
      caseYear: extractField(rawText, ['Case Year']),
      filingNumber: extractField(rawText, ['Filing Number', 'Filing No\\.']),
      filingDate: extractField(rawText, ['Filing Date', 'Date of Filing']),
      registrationNumber: extractField(rawText, ['Registration Number', 'Registration No\\.']),
      registrationDate: extractField(rawText, ['Registration Date']),
      cnrNumber: extractField(rawText, ['CNR Number', 'CNR No\\.', 'CNR']),
      caseStatus: extractField(rawText, ['Case Status', 'Status']),
      firstHearingDate: extractField(rawText, ['First Hearing Date']),
      decisionDate: extractField(rawText, ['Decision Date', 'Date of Decision']),
      natureOfDisposal: extractField(rawText, ['Nature of Disposal']),
      lastOrder: extractField(rawText, ['Last Order', 'Last Proceedings', 'Order Details']),
      courtNumber: extractField(rawText, ['Court Number', 'Court No\\.']),
      judge: extractField(rawText, ['Judge'])
    },
    parties: parseParties(rawText),
    actsAndSections: parseActs(rawText),
    caseHistory: parseHistory(rawText)
  };
};
