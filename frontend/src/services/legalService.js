import api from './api';

export const getLegalServices = async () => {
  try {
    const response = await api.get('/legal-services');
    return response.data;
  } catch (error) {
    console.error('Error fetching legal services:', error);
    return [];
  }
};

export const getLegalServiceByType = async (type) => {
  try {
    const response = await api.get(`/legal-services/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching legal service ${type}:`, error);
    return null;
  }
};

export const searchLegalServices = async (query) => {
  try {
    if (!query) return [];
    const response = await api.get(`/legal-services/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching legal services:', error);
    return [];
  }
};

export const getLegalAuthorities = async (state, district) => {
  try {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    if (district) params.append('district', district);
    
    const response = await api.get(`/legal-services/authorities?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching authorities:', error);
    return [];
  }
};

export const askLegalAssistant = async (question, language = 'en') => {
  try {
    const response = await api.post('/legal-services/ask', { question, language });
    return response.data.answer;
  } catch (error) {
    console.error('Error asking legal assistant:', error);
    return "I am sorry, there was a problem connecting to the AI server. Please try again.";
  }
};
