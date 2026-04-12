import API_BASE_URL from './apiConfig';

/**
 * Fetch parsed slip/measurement data from the backend
 */
export const fetchSlipData = async (id = null) => {
  const url = id ? `${API_BASE_URL}/slip-data?id=${id}` : `${API_BASE_URL}/slip-data`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch slip data');
  return res.json();
};

/**
 * Trigger backend to fetch source CSV and create a new copy
 */
export const triggerFetchData = async () => {
  const res = await fetch(`${API_BASE_URL}/fetch-data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to trigger data fetch');
  }
  return res.json();
};
