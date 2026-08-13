import api from './api';
import { mockCases, mockTimeline, mockProceedings } from '../data/mockData';

// Wrap mock data in a promise to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getDashboardStats = async () => {
  // Placeholder for GET /api/dashboard
  await delay(500);
  return {
    activeCases: 3,
    upcomingHearings: 2,
    documents: 15,
    recentUpdates: 8,
  };
};

export const getCases = async () => {
  // Placeholder for GET /api/cases
  await delay(500);
  return mockCases;
};

export const getCaseById = async (id) => {
  // Placeholder for GET /api/cases/:id
  await delay(500);
  return mockCases.find(c => c.id === id) || null;
};

export const searchCases = async (query) => {
  // Placeholder for GET /api/cases/search?q=
  await delay(500);
  if (!query) return mockCases;
  const lowerQ = query.toLowerCase();
  return mockCases.filter(c => 
    c.cnrNumber.toLowerCase().includes(lowerQ) ||
    c.caseNumber.toLowerCase().includes(lowerQ) ||
    c.petitioner.toLowerCase().includes(lowerQ) ||
    c.respondent.toLowerCase().includes(lowerQ)
  );
};

export const getCaseTimeline = async (id) => {
  // Placeholder for GET /api/cases/:id/timeline
  await delay(500);
  return mockTimeline[id] || [];
};

export const getCaseProceedings = async (id) => {
  // Placeholder for GET /api/cases/:id/proceedings
  await delay(500);
  return mockProceedings[id] || [];
};
