const API_URL = 'http://localhost:5000/api/dashboard';

export const fetchDashboardStats = async () => {
  const response = await fetch(`${API_URL}/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard statistics');
  }
  return response.json();
};
