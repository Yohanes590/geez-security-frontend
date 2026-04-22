/**
 * API Client for connecting to the Express backend
 */

// Backend base URL - adjust based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://geez-reg-back.onrender.com/api';

/**
 * Generic API request function with error handling
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    // console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * File upload helper
 */
async function uploadFile(endpoint, formData, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      ...options,
      // Don't set Content-Type header for multipart/form-data
      // Let the browser set it automatically with the boundary
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'File upload failed');
    }
console.log("data returned from uploadFile",data)
    return data;
  } catch (error) {
    // console.error(`Upload Error (${endpoint}):`, error);
    throw error;
  }
}

// API Functions
const api = {
  // Registration
  register: async (registrationData) => {
    return apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  getRegistration: async (id) => {
    return apiRequest(`/register/${id}`);
  },

  getRegistrationsByEmail: async (email) => {
    return apiRequest(`/register/email/${email}`);
  },

  updateRegistrationStatus: async (id, status) => {
    return apiRequest(`/register/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Payment Verification
  verifyPayment: async (verificationData) => {
    return apiRequest('/verify-payment', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  },

  getVerificationHistory: async (registrationId) => {
    return apiRequest(`/verify-payment/registration/${registrationId}`);
  },

  // Receipt Extraction
  extractReceiptData: async (imageFile, paymentMethod, registrationId = null) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('paymentMethod', paymentMethod);
    if (registrationId) {
      formData.append('registrationId', registrationId);
    }

    return uploadFile('/extract-receipt-data', formData);
  },

  // Coupons
  validateCoupon: async (code) => {
    return apiRequest(`/coupons/${code}/validate`);
  },
  
  // Courses
  getAllCourses: async () => {
    return apiRequest('/courses');
  },
  
  getCourse: async (idOrSlug) => {
    return apiRequest(`/courses/${idOrSlug}`);
  },
};

export default api; 