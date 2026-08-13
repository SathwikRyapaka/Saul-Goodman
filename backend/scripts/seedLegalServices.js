const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const LegalService = require('../models/LegalService');
const LegalAuthority = require('../models/LegalAuthority');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const services = [
  {
    service_type: 'legal-aid',
    title: 'Legal Aid',
    description: 'Free legal services provided to eligible citizens under the Legal Services Authorities Act, 1987. This ensures that opportunities for securing justice are not denied to any citizen by reason of economic or other disabilities.',
    eligibility_information: [
      {
        category: 'Income',
        description: 'Individuals whose annual income is less than the prescribed limit (e.g., less than ₹3,00,000 in Telangana, though this may vary).',
        source: 'Legal Services Authorities Act, 1987 (Sec 12)'
      },
      {
        category: 'Women and Children',
        description: 'All women and children are eligible for free legal aid irrespective of their income.',
        source: 'Legal Services Authorities Act, 1987'
      },
      {
        category: 'SC/ST',
        description: 'Members of Scheduled Castes and Scheduled Tribes.',
        source: 'Legal Services Authorities Act, 1987'
      },
      {
        category: 'Industrial Workmen',
        description: 'Industrial workmen are eligible for free legal aid.',
        source: 'Legal Services Authorities Act, 1987'
      },
      {
        category: 'Victims',
        description: 'Victims of mass disaster, ethnic violence, caste atrocity, flood, drought, earthquake or industrial disaster.',
        source: 'Legal Services Authorities Act, 1987'
      }
    ],
    process_steps: [
      { stepNumber: 1, title: 'Check Eligibility', description: 'Determine if you fall under any of the eligible categories for free legal aid.' },
      { stepNumber: 2, title: 'Approach Authority', description: 'Visit or contact the nearest District Legal Services Authority (DLSA) or Taluk Legal Services Committee.' },
      { stepNumber: 3, title: 'Submit Application', description: 'Fill out the application form for legal aid and attach necessary documents (e.g., income certificate, identity proof).' },
      { stepNumber: 4, title: 'Evaluation', description: 'The authority evaluates the application and assigns a panel lawyer if approved.' }
    ],
    documents_information: [
      'Proof of identity (Aadhar Card, Voter ID, etc.)',
      'Income Certificate or Affidavit of Income',
      'Caste Certificate (if applicable)',
      'Any relevant legal notices, court orders, or case documents'
    ],
    faqs: [
      { question: 'What does free legal aid cover?', answer: 'It covers payment of court fees, drafting of legal documents, and providing a lawyer for legal proceedings.' },
      { question: 'Do I need to pay the lawyer assigned to me?', answer: 'No, lawyers provided under the Legal Services Authorities Act are paid by the government. You do not need to pay them.' }
    ],
    official_sources: [
      { title: 'National Legal Services Authority (NALSA)', url: 'https://nalsa.gov.in/' },
      { title: 'Telangana State Legal Services Authority (TSLSA)', url: 'https://tslsa.telangana.gov.in/' }
    ]
  },
  {
    service_type: 'mediation',
    title: 'Mediation',
    description: 'Mediation is an alternative dispute resolution (ADR) process where a neutral third party (the mediator) helps disputing parties communicate, negotiate, and reach a voluntary agreement.',
    eligibility_information: [
      {
        category: 'Nature of Dispute',
        description: 'Civil, commercial, family, and matrimonial disputes are often suitable for mediation.',
        source: 'Code of Civil Procedure, Section 89'
      },
      {
        category: 'Willingness',
        description: 'Both parties must generally be willing to participate in the mediation process.',
        source: 'General Mediation Principles'
      }
    ],
    process_steps: [
      { stepNumber: 1, title: 'Referral', description: 'A court may refer a pending case to mediation, or parties can voluntarily opt for pre-litigation mediation.' },
      { stepNumber: 2, title: 'Appointment of Mediator', description: 'A neutral and trained mediator is appointed to facilitate the discussion.' },
      { stepNumber: 3, title: 'Joint and Private Sessions', description: 'The mediator holds joint sessions with all parties and may hold private, confidential sessions with each party.' },
      { stepNumber: 4, title: 'Agreement', description: 'If a resolution is reached, a settlement agreement is drafted and signed by the parties.' }
    ],
    documents_information: [
      'Brief summary of the dispute',
      'Relevant contracts or agreements',
      'Previous court orders (if it is a court-referred mediation)'
    ],
    faqs: [
      { question: 'Is mediation binding?', answer: 'A mediation settlement agreement signed by the parties and the mediator is legally binding and can be enforced like a court decree in many cases.' },
      { question: 'Is the process confidential?', answer: 'Yes, everything discussed during mediation is strictly confidential and cannot be used as evidence in court if mediation fails.' }
    ],
    official_sources: [
      { title: 'Mediation and Conciliation Project Committee (MCPC)', url: 'https://main.sci.gov.in/mediation' }
    ]
  },
  {
    service_type: 'lok-adalat',
    title: 'Lok Adalat',
    description: 'Lok Adalat (People\'s Court) is an alternative dispute resolution mechanism where disputes/cases pending in the court of law or at the pre-litigation stage are settled/compromised amicably.',
    eligibility_information: [
      {
        category: 'Pending Cases',
        description: 'Cases pending before any court can be referred to Lok Adalat if both parties agree.',
        source: 'Legal Services Authorities Act, 1987'
      },
      {
        category: 'Pre-litigation',
        description: 'Disputes that have not yet been brought before a court can also be settled in Lok Adalat.',
        source: 'Legal Services Authorities Act, 1987'
      }
    ],
    process_steps: [
      { stepNumber: 1, title: 'Application', description: 'Parties apply to the court or the Legal Services Authority to refer the matter to Lok Adalat.' },
      { stepNumber: 2, title: 'Notice', description: 'Notices are issued to the parties informing them of the date and time of the Lok Adalat.' },
      { stepNumber: 3, title: 'Hearing and Compromise', description: 'The Lok Adalat bench assists the parties in reaching an amicable settlement.' },
      { stepNumber: 4, title: 'Award', description: 'If settled, the Lok Adalat passes an award which is final and binding.' }
    ],
    documents_information: [
      'Case details and CNR number (for pending cases)',
      'Details of the dispute (for pre-litigation)',
      'Identity proof'
    ],
    faqs: [
      { question: 'Can I appeal against a Lok Adalat award?', answer: 'No, there is no provision for an appeal against an award passed by a Lok Adalat. The award is final and binding.' },
      { question: 'Do I have to pay court fees?', answer: 'There is no court fee payable when a matter is filed in a Lok Adalat. If a pending case is settled in Lok Adalat, the court fee originally paid is refunded.' }
    ],
    official_sources: [
      { title: 'NALSA - Lok Adalat', url: 'https://nalsa.gov.in/lok-adalat' }
    ]
  }
];

const authorities = [
  {
    state: 'Telangana',
    district: 'Hyderabad',
    authority_name: 'District Legal Services Authority, Hyderabad',
    address: 'City Civil Court Complex, Purani Haveli, Hyderabad, Telangana',
    phone: '040-23446182', // Placeholder/General format
    email: 'dlsa.hyd@nyayasetu.example.com',
    website: 'https://districts.ecourts.gov.in/hyderabad',
    source: 'eCourts Directory'
  },
  {
    state: 'Telangana',
    district: 'Sangareddy',
    authority_name: 'District Legal Services Authority, Sangareddy',
    address: 'District Court Complex, Sangareddy, Telangana',
    phone: '08455-276000', // Placeholder/General format
    email: 'dlsa.sangareddy@nyayasetu.example.com',
    website: 'https://districts.ecourts.gov.in/sangareddy',
    source: 'eCourts Directory'
  },
  {
    state: 'Telangana',
    district: 'Ranga Reddy',
    authority_name: 'District Legal Services Authority, Ranga Reddy',
    address: 'District Court Complex, L.B. Nagar, Ranga Reddy, Telangana',
    phone: '040-24021234', // Placeholder/General format
    email: 'dlsa.rr@nyayasetu.example.com',
    website: 'https://districts.ecourts.gov.in/rangareddy',
    source: 'eCourts Directory'
  }
];

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing
    await LegalService.deleteMany();
    await LegalAuthority.deleteMany();
    console.log('Cleared existing legal services and authorities');

    // Insert new
    await LegalService.insertMany(services);
    console.log(`Inserted ${services.length} legal services`);

    await LegalAuthority.insertMany(authorities);
    console.log(`Inserted ${authorities.length} legal authorities`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error with seeding:', err);
    process.exit(1);
  }
};

seedDB();
