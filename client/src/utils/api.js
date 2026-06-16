
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';


export const apiRequest = async (endpoint, getAccessToken, options = {}) => {
  try {

    const token = await getAccessToken();

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed: ${response.statusText}`);
    }


    return await response.json();
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
};


export const userAPI = {

  getCurrentUser: (getAccessToken) => 
    apiRequest('/api/users/me', getAccessToken),
};

export const applicationAPI = {
 
  getAll: (getAccessToken, queryParams = {}) => {
    const params = new URLSearchParams(queryParams).toString();
    const endpoint = `/api/applications${params ? `?${params}` : ''}`;
    return apiRequest(endpoint, getAccessToken);
  },

  getById: (getAccessToken, id) => 
    apiRequest(`/api/applications/${id}`, getAccessToken),

  getStatusHistory: (getAccessToken, id) =>
    apiRequest(`/api/applications/${id}/history`, getAccessToken),

  clearStatusHistory: (getAccessToken, id) =>
    apiRequest(`/api/applications/${id}/history`, getAccessToken, {
      method: 'DELETE',
    }),

  updateStatusHistoryEntry: (getAccessToken, applicationId, historyId, data) =>
    apiRequest(`/api/applications/${applicationId}/history/${historyId}`, getAccessToken, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),


  create: (getAccessToken, data) => 
    apiRequest('/api/applications', getAccessToken, {
      method: 'POST',
      body: JSON.stringify(data),
    }),


  update: (getAccessToken, id, data) => 
    apiRequest(`/api/applications/${id}`, getAccessToken, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),


  delete: (getAccessToken, id) => 
    apiRequest(`/api/applications/${id}`, getAccessToken, {
      method: 'DELETE',
    }),


  deleteAll: (getAccessToken) => 
    apiRequest('/api/applications', getAccessToken, {
      method: 'DELETE',
    }),
};

export default {
  userAPI,
  applicationAPI,
};

