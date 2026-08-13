export const mockCases = [
  {
    id: "1",
    caseNumber: "OS/101/2025",
    cnrNumber: "DEMO-TS-2026-0001",
    court: "District Court, Hyderabad",
    district: "Hyderabad",
    caseType: "Original Suit (OS)",
    category: "Property Dispute",
    filingDate: "2025-04-12",
    petitioner: "Arjun Rao",
    respondent: "Vikram Reddy",
    currentStage: "Evidence",
    status: "Pending",
    nextHearing: "2026-08-20",
    updates: 3
  },
  {
    id: "2",
    caseNumber: "FCOP/45/2026",
    cnrNumber: "DEMO-TS-2026-0089",
    court: "Family Court, Secunderabad",
    district: "Hyderabad",
    caseType: "Family Court Original Petition",
    category: "Family",
    filingDate: "2026-01-15",
    petitioner: "Priya Sharma",
    respondent: "Ramesh Sharma",
    currentStage: "Mediation",
    status: "Pending",
    nextHearing: "2026-08-25",
    updates: 1
  },
  {
    id: "3",
    caseNumber: "CC/202/2024",
    cnrNumber: "DEMO-TS-2024-0555",
    court: "District Consumer Forum",
    district: "Rangareddy",
    caseType: "Consumer Complaint",
    category: "Consumer",
    filingDate: "2024-11-05",
    petitioner: "Kiran Kumar",
    respondent: "Global Electronics Ltd",
    currentStage: "Arguments",
    status: "Pending",
    nextHearing: "2026-09-10",
    updates: 5
  }
];

export const mockTimeline = {
  "1": [
    { id: 1, date: "2025-04-12", stage: "Case Filed", description: "Original suit filed by petitioner.", status: "completed" },
    { id: 2, date: "2026-06-18", stage: "Notice", description: "Notices issued to respondent.", status: "completed" },
    { id: 3, date: "2026-07-22", stage: "Evidence", description: "Supporting documents were submitted and the matter was listed for further proceedings.", status: "current" },
    { id: 4, date: null, stage: "Arguments", description: "Final arguments to be heard.", status: "upcoming" },
    { id: 5, date: null, stage: "Judgment", description: "Final verdict.", status: "upcoming" }
  ]
};

export const mockProceedings = {
  "1": [
    { id: 1, date: "2026-07-22", stage: "Evidence", description: "Supporting documents were submitted and the matter was listed for further proceedings." },
    { id: 2, date: "2026-06-18", stage: "Notice", description: "Respondent appeared and requested time to file counter." },
    { id: 3, date: "2025-04-12", stage: "Filing", description: "Case admitted and notices ordered." }
  ]
};

export const mockDocuments = [
  { id: 1, name: "Court_Order_01.pdf", type: "Court Order", caseNumber: "OS/101/2025", date: "2026-08-01", format: "PDF", size: "1.2 MB" },
  { id: 2, name: "Petition_Copy.pdf", type: "Petition", caseNumber: "OS/101/2025", date: "2025-04-12", format: "PDF", size: "3.5 MB" },
  { id: 3, name: "Notice_Receipt.jpg", type: "Notice", caseNumber: "OS/101/2025", date: "2026-06-18", format: "JPG", size: "500 KB" },
];

export const mockNotifications = [
  { id: 1, title: "Upcoming Hearing", message: "OS/101/2025 is scheduled for 20 August 2026.", date: "2026-08-10", read: false, type: "hearing" },
  { id: 2, title: "Case Update", message: "A new proceeding has been recorded for FCOP/45/2026.", date: "2026-08-12", read: false, type: "update" },
  { id: 3, title: "Document Ready", message: "Your document summary is available for Court_Order_01.pdf.", date: "2026-08-13", read: true, type: "document" }
];
