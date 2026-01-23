/**
 * API Service - Axios instance for backend communication
 * Currently using Gemini API directly from frontend
 * Can be switched to backend endpoints later
 */

// Default aligns with the Express backend default port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

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
 * Patient Endpoints
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
 * Doctor Endpoints
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

  reviewLabReport: (reportId: string, data: any) =>
    apiRequest(`/doctor/lab-reports/${reportId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getEarnings: () => apiRequest('/doctor/earnings'),

  getAIInsights: () => apiRequest('/doctor/ai-insights'),
};

/**
 * Admin Endpoints
 */
export const admin = {
  getDashboard: () => apiRequest('/admin/dashboard'),

  getUsers: () => apiRequest('/admin/users'),

  updateUser: (userId: string, data: any) =>
    apiRequest(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteUser: (userId: string) =>
    apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    }),

  getPendingDoctors: () => apiRequest('/admin/doctors/pending'),

  verifyDoctor: (doctorId: string, approved: boolean) =>
    apiRequest(`/admin/doctors/${doctorId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ approved }),
    }),

  getAppointments: () => apiRequest('/admin/appointments'),

  getAIMonitoring: () => apiRequest('/admin/ai-monitoring'),

  getAuditLogs: () => apiRequest('/admin/audit-logs'),

  getRevenue: () => apiRequest('/admin/revenue'),
};

/**
 * AI Consultation Endpoints
 */
export const aiConsultation = {
  startConsultation: (data: any) =>
    apiRequest('/ai/consult/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  sendMessage: (consultationId: string, message: string) =>
    apiRequest('/ai/consult/message', {
      method: 'POST',
      body: JSON.stringify({ consultationId, message }),
    }),

  analyzeSymptoms: (data: any) =>
    apiRequest('/ai/consult/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getConsultation: (consultationId: string) =>
    apiRequest(`/ai/consult/${consultationId}`),

  saveToTimeline: (consultationId: string) =>
    apiRequest(`/ai/consult/${consultationId}/save`, {
      method: 'POST',
    }),

  getHistory: () => apiRequest('/ai/consult/history'),

  analyzeLabReport: (reportData: any) =>
    apiRequest('/ai/analyze-report', {
      method: 'POST',
      body: JSON.stringify(reportData),
    }),
};

export default {
  auth,
  patient,
  doctor,
  admin,
  aiConsultation,
};
