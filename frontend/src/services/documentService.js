import api from './api';

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

export const getDocumentSummary = async (documentId) => {
  const response = await api.get(`/documents/${documentId}/summary`);
  return response.data;
};
