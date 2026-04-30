import API_BASE_URL from './apiConfig';

/**
 * Submit the form data with image file
 */
export const submitForm = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/forms`, {
    method: 'POST',
    body: formData, // FormData object (multipart/form-data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit form');
  }
  return res.json();
};
/**
 * Fetch all form entries with pagination and search
 */
export const getAllForms = async (params = {}) => {
    const { page = 1, limit = 10, search = '', startDate = '', endDate = '' } = params;
    const query = new URLSearchParams({ page, limit, search, startDate, endDate }).toString();
    const res = await fetch(`${API_BASE_URL}/forms?${query}`);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch forms');
    }
    return res.json();
};

/**
 * Fetch all measurement entries with pagination and filters
 */
export const getAllMeasurements = async (params = {}) => {
    const { page = 1, limit = 10, search = '', status = '', startDate = '', endDate = '' } = params;
    const query = new URLSearchParams({ page, limit, search, status, startDate, endDate }).toString();
    const res = await fetch(`${API_BASE_URL}/measurements?${query}`);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch measurements');
    }
    return res.json();
};
/**
 * Update form data
 */
export const updateForm = async (id, formData) => {
    const res = await fetch(`${API_BASE_URL}/forms/${id}`, {
        method: 'PUT',
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update form');
    }
    return res.json();
};

/**
 * Delete a measurement entry
 */
export const deleteMeasurement = async (id) => {
    const res = await fetch(`${API_BASE_URL}/measurements/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete measurement');
    }
    return res.json();
};

/**
 * Delete a form and all associated data
 */
export const deleteForm = async (id) => {
    const res = await fetch(`${API_BASE_URL}/forms/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete form');
    }
    return res.json();
};
