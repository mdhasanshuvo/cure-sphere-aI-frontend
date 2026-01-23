/**
 * Enhanced API Service with MongoDB endpoints
 */

// Ensure API base URL always includes /api
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const API_BASE_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

/**
 * Make API request with error handling
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// ============ DATABASE ENDPOINTS ============

/**
 * Users Endpoints
 */
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

/**
 * Doctors Endpoints
 */
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

/**
 * Pharmacies Endpoints
 */
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

/**
 * Blood Bank Endpoints
 */
export const bloodBank = {
  getAllBanks: (page = 1, limit = 10, filters?: any) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.area) params.append('area', filters.area);
    if (filters?.rating) params.append('rating', filters.rating);
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

/**
 * Hospitals Endpoints
 */
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

/**
 * Health Reports Endpoints
 */
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

/**
 * Software Info Endpoints
 */
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

/**
 * Subscription Plans Endpoints
 */
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

/**
 * Admin Endpoints
 */
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

// ============ LEGACY ENDPOINTS (KEPT FOR COMPATIBILITY) ============

/**
 * Authentication Endpoints
 */
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

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  refreshToken: () =>
    apiRequest('/auth/refresh-token', {
      method: 'POST',
    }),
};

/**
 * Patient Endpoints (Legacy)
 */
export const patient = {
  getDashboard: () => apiRequest('/patient/dashboard'),

  getTimeline: () => apiRequest('/patient/timeline'),

  addTimelineEntry: (data: any) =>
    apiRequest('/patient/timeline', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: () => apiRequest('/patient/profile'),

  updateProfile: (data: any) =>
    apiRequest('/patient/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getAppointments: () => apiRequest('/patient/appointments'),

  bookAppointment: (data: any) =>
    apiRequest('/patient/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getLabReports: () => apiRequest('/patient/lab-reports'),

  uploadLabReport: (data: FormData) =>
    apiRequest('/patient/lab-reports', {
      method: 'POST',
      body: data,
      headers: {}, // Don't set Content-Type for FormData
    }),

  getPrescriptions: () => apiRequest('/patient/prescriptions'),

  orderMedicine: (data: any) =>
    apiRequest('/patient/medicine-order', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

/**
 * Doctor Endpoints (Legacy)
 */
export const doctor = {
  getDashboard: () => apiRequest('/doctor/dashboard'),

  getPatients: (query?: string) =>
    apiRequest(`/doctor/patients${query ? `?${query}` : ''}`),

  getPatientDetails: (patientId: string) =>
    apiRequest(`/doctor/patients/${patientId}`),

  getAppointments: () => apiRequest('/doctor/appointments'),

  updateAppointment: (appointmentId: string, data: any) =>
    apiRequest(`/doctor/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  createPrescription: (data: any) =>
    apiRequest('/doctor/prescriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getLabReports: () => apiRequest('/doctor/lab-reports'),
};
