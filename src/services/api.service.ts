/**
 * Unified API Service - Single source of truth for all backend communication
 * Replaces both api.ts and mongoApi.ts
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

/**
 * Generic API request handler
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: AbortSignal.timeout(30000),
    });

    // Handle auth errors
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// ============ AUTH ENDPOINTS ============

export const auth = {
  register: (data: any) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: any) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    return Promise.resolve();
  },

  refreshToken: () =>
    apiRequest('/auth/refresh-token', {
      method: 'POST',
    }),
};

// ============ USERS ENDPOINTS ============

export const users = {
  getAll: (page = 1, limit = 10) =>
    apiRequest(`/users?page=${page}&limit=${limit}`),

  getById: (id: string) => apiRequest(`/users/${id}`),

  getByRole: (role: string) => apiRequest(`/users/role/${role}`),

  create: (data: any) =>
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// ============ DOCTORS ENDPOINTS ============

export const doctors = {
  getAll: (page = 1, limit = 10, filters?: any) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.specialization) params.append('specialization', filters.specialization);
    if (filters?.rating) params.append('rating', filters.rating);
    return apiRequest(`/doctors?${params.toString()}`);
  },

  getById: (id: string) => apiRequest(`/doctors/${id}`),

  getBySpecialization: (specialization: string) =>
    apiRequest(`/doctors/specialization/${specialization}`),

  create: (data: any) =>
    apiRequest('/doctors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/doctors/${id}`, {
      method: 'DELETE',
    }),
};

// ============ PHARMACIES ENDPOINTS ============

export const pharmacies = {
  getAll: (page = 1, limit = 10, filters?: any) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.area) params.append('area', filters.area);
    if (filters?.rating) params.append('rating', filters.rating);
    return apiRequest(`/pharmacies?${params.toString()}`);
  },

  getById: (id: string) => apiRequest(`/pharmacies/${id}`),

  getStock: (id: string) => apiRequest(`/pharmacies/${id}/stock`),

  create: (data: any) =>
    apiRequest('/pharmacies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/pharmacies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateStock: (id: string, stock: any) =>
    apiRequest(`/pharmacies/${id}/stock`, {
      method: 'POST',
      body: JSON.stringify(stock),
    }),

  delete: (id: string) =>
    apiRequest(`/pharmacies/${id}`, {
      method: 'DELETE',
    }),
};

// ============ BLOOD BANK ENDPOINTS ============

export const bloodBank = {
  getAllBanks: (page = 1, limit = 10, filters?: any) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.area) params.append('area', filters.area);
    return apiRequest(`/blood-bank/banks?${params.toString()}`);
  },

  getBankById: (id: string) => apiRequest(`/blood-bank/banks/${id}`),

  getAllDonors: (page = 1, limit = 10, filters?: any) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.bloodGroup) params.append('bloodGroup', filters.bloodGroup);
    if (filters?.division) params.append('division', filters.division);
    return apiRequest(`/blood-bank/donors?${params.toString()}`);
  },

  getDonorById: (id: string) => apiRequest(`/blood-bank/donors/${id}`),

  createBank: (data: any) =>
    apiRequest('/blood-bank/banks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createDonor: (data: any) =>
    apiRequest('/blood-bank/donors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateBank: (id: string, data: any) =>
    apiRequest(`/blood-bank/banks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateDonor: (id: string, data: any) =>
    apiRequest(`/blood-bank/donors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteBank: (id: string) =>
    apiRequest(`/blood-bank/banks/${id}`, {
      method: 'DELETE',
    }),

  deleteDonor: (id: string) =>
    apiRequest(`/blood-bank/donors/${id}`, {
      method: 'DELETE',
    }),
};

// ============ HOSPITALS ENDPOINTS ============

export const hospitals = {
  getAll: (page = 1, limit = 10, filters?: any) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.area) params.append('area', filters.area);
    if (filters?.department) params.append('department', filters.department);
    return apiRequest(`/hospitals?${params.toString()}`);
  },

  getById: (id: string) => apiRequest(`/hospitals/${id}`),

  create: (data: any) =>
    apiRequest('/hospitals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/hospitals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/hospitals/${id}`, {
      method: 'DELETE',
    }),
};

// ============ HEALTH REPORTS ENDPOINTS ============

export const healthReports = {
  getAll: (page = 1, limit = 10, filters?: any) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.reportType) params.append('reportType', filters.reportType);
    return apiRequest(`/health-reports?${params.toString()}`);
  },

  getById: (id: string) => apiRequest(`/health-reports/${id}`),

  getByUserId: (userId: string) => apiRequest(`/health-reports/user/${userId}`),

  create: (data: any) =>
    apiRequest('/health-reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/health-reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/health-reports/${id}`, {
      method: 'DELETE',
    }),
};

// ============ SOFTWARE INFO ENDPOINTS ============

export const softwareInfo = {
  get: () => apiRequest('/software-info'),

  update: (data: any) =>
    apiRequest('/software-info', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  increment: (field: string, amount = 1) =>
    apiRequest('/software-info/increment', {
      method: 'POST',
      body: JSON.stringify({ field, amount }),
    }),
};

// ============ SUBSCRIPTIONS ENDPOINTS ============

export const subscriptions = {
  getAll: (page = 1, limit = 10, filters?: any) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.status) params.append('status', filters.status);
    return apiRequest(`/subscriptions?${params.toString()}`);
  },

  getByUserId: (userId: string) => apiRequest(`/subscriptions/user/${userId}`),

  create: (data: any) =>
    apiRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  cancel: (id: string) =>
    apiRequest(`/subscriptions/${id}/cancel`, {
      method: 'POST',
    }),

  delete: (id: string) =>
    apiRequest(`/subscriptions/${id}`, {
      method: 'DELETE',
    }),
};

// ============ ADMINS ENDPOINTS ============

export const admins = {
  getAll: (page = 1, limit = 10, filters?: any) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.adminLevel) params.append('adminLevel', filters.adminLevel);
    return apiRequest(`/admins?${params.toString()}`);
  },

  getById: (id: string) => apiRequest(`/admins/${id}`),

  create: (data: any) =>
    apiRequest('/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  logActivity: (id: string, activity: any) =>
    apiRequest(`/admins/${id}/activity`, {
      method: 'POST',
      body: JSON.stringify(activity),
    }),

  delete: (id: string) =>
    apiRequest(`/admins/${id}`, {
      method: 'DELETE',
    }),
};

// ============ GEMINI AI ENDPOINTS ============

export const gemini = {
  generate: (contents: any, generationConfig?: any) =>
    apiRequest('/gemini/generate', {
      method: 'POST',
      body: JSON.stringify({ contents, generationConfig }),
    }),

  analyzeSymptoms: (input: any) =>
    apiRequest('/gemini/analyze-symptoms', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
};

export default {
  auth,
  users,
  doctors,
  pharmacies,
  bloodBank,
  hospitals,
  healthReports,
  softwareInfo,
  subscriptions,
  admins,
  gemini,
};
