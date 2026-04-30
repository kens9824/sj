import BASE_URL from './apiConfig';
  
const API_URL = `${BASE_URL}/dashboard`;

export const fetchDashboardStats = async () => {
  const response = await fetch(`${API_URL}/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard statistics');
  }
  return response.json();
};
