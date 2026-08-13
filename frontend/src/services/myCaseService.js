import api from './api';

export const addToMyCases = async (caseId) => {
  const response = await api.post('/my-cases', { case_id: caseId });
  return response.data;
};

export const getMyCases = async () => {
  const response = await api.get('/my-cases');
  return response.data;
};

export const removeFromMyCases = async (caseId) => {
  const response = await api.delete(`/my-cases/${caseId}`);
  return response.data;
};

export const checkMyCasesStatus = async (caseIds) => {
  const response = await api.post('/my-cases/check', { caseIds });
  return response.data;
};
