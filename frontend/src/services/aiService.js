import api from './api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const explainCaseById = async (caseId) => {
  try {
    const response = await api.post(`/ai/case/${caseId}/explain`);
    return response.data;
  } catch (error) {
    console.error('AI Explanation Error:', error);
    throw new Error(error.response?.data?.message || 'An error occurred while generating the explanation.');
  }
};

export const processVoiceQuery = async (query) => {
  try {
    const response = await api.post('/ai/voice', { query });
    return response.data.response;
  } catch (error) {
    console.error('AI Service Error:', error);
    return "I am sorry, there was a problem connecting to the AI server. Please try again.";
  }
};
