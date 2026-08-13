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
  // We aren't implementing GET all cases as per requirements, but keeping signature
  return [];
};

export const getCaseById = async (id) => {
  try {
    const response = await api.get(`/cases/${id}`);
    if (response.data.success) {
      return response.data.case;
    }
    return null;
  } catch (error) {
    console.error("Error fetching case details:", error);
    return null;
  }
};

export const searchCases = async (query) => {
  try {
    const response = await api.get(`/cases/search?q=${encodeURIComponent(query)}`);
    if (response.data.success) {
      return response.data.cases;
    }
    return [];
  } catch (error) {
    console.error("Error searching cases:", error);
    return [];
  }
};

export const getCaseTimeline = async (id) => {
  // Since we fetch the full case by ID and it contains case_history, we will just pass the case_history into this or handle it in CaseDetails.
  // Leaving this stubbed to not break the UI if it relies on it.
  await delay(500);
  return [];
};

export const getCaseProceedings = async (id) => {
  await delay(500);
  return [];
};
