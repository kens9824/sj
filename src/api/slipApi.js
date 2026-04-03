const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch parsed slip/measurement data from the backend
 */
export const fetchSlipData = async (id = null) => {
  const url = id ? `${API_BASE_URL}/slip-data?id=${id}` : `${API_BASE_URL}/slip-data`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch slip data');
  return res.json();
};
