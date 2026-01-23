import { useState } from 'react';
import { Users, BarChart3, AlertCircle, CheckCircle, Activity, DollarSign } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { User } from '../../types';

interface AdminDashboardProps {
  user: User;
  onNavigate?: (page: string) => void;
}

// Mock data
const ANALYTICS_DATA = [
  { day: 'Mon', users: 120, consultations: 45, appointments: 32 },
  { day: 'Tue', users: 150, consultations: 52, appointments: 38 },
  { day: 'Wed', users: 140, consultations: 48, appointments: 35 },
  { day: 'Thu', users: 180, consultations: 65, appointments: 48 },
  { day: 'Fri', users: 200, consultations: 72, appointments: 52 },
  { day: 'Sat', users: 220, consultations: 85, appointments: 60 },
  { day: 'Sun', users: 190, consultations: 70, appointments: 50 },
];

const SYMPTOM_DATA = [
  { name: 'Fever', value: 245 },
  { name: 'Cough', value: 189 },
  { name: 'Headache', value: 156 },
  { name: 'Flu', value: 142 },
  { name: 'Others', value: 268 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const PENDING_DOCTORS = [
  { id: '1', name: 'Dr. Hasib Ahmed', bmdc: '12345', specialization: 'Cardiologist', status: 'pending' },
  { id: '2', name: 'Dr. Sarah Khan', bmdc: '12346', specialization: 'Neurologist', status: 'pending' },
];

export function AdminDashboard(_props: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'doctors' | 'ai-monitoring'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard 🏥</h1>
          <p className="text-gray-600">System oversight and management</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {['overview', 'users', 'doctors', 'ai-monitoring'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-3 px-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'users' && 'Users'}
              {tab === 'doctors' && 'Doctors'}
              {tab === 'ai-monitoring' && 'AI Monitoring'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Total</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Total Users</h3>
                <p className="text-3xl font-bold text-gray-900">2,847</p>
                <p className="text-xs text-gray-500 mt-2">Patients, Doctors & Admins</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Today</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Daily AI Consultations</h3>
                <p className="text-3xl font-bold text-gray-900">245</p>
                <p className="text-xs text-gray-500 mt-2">Active consultations</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Monthly</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Total Appointments</h3>
                <p className="text-3xl font-bold text-gray-900">1,284</p>
                <p className="text-xs text-gray-500 mt-2">Completed this month</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Monthly</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Total Revenue</h3>
                <p className="text-3xl font-bold text-gray-900">৳5.2L</p>
                <p className="text-xs text-gray-500 mt-2">Platform commission</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Activity Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ANALYTICS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="New Users" />
                    <Line type="monotone" dataKey="consultations" stroke="#10B981" strokeWidth={2} name="Consultations" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top Symptoms */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Most Reported Symptoms</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={SYMPTOM_DATA}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value})`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {SYMPTOM_DATA.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pending Doctor Approvals */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Pending Doctor Approvals</h2>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full">
                  {PENDING_DOCTORS.length} Pending
                </span>
              </div>
              <div className="space-y-4">
                {PENDING_DOCTORS.map((doctor) => (
                  <div key={doctor.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <span>📋 BMDC: {doctor.bmdc}</span>
                          <span>🔬 {doctor.specialization}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">
                          Reject
                        </button>
                        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <input
                type="text"
                placeholder="Search users..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-gray-600">User management table coming soon...</p>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Doctor Management</h2>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                + Add Doctor
              </button>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-gray-600">Doctor list and management coming soon...</p>
            </div>
          </div>
        )}

        {/* AI Monitoring Tab */}
        {activeTab === 'ai-monitoring' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">AI System Monitoring</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Flagged Recommendations
                </h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-700 bg-orange-50 p-3 rounded-lg">
                    <p className="font-semibold">Potential Hallucination Detected</p>
                    <p className="text-xs text-gray-600 mt-1">AI suggested rare medication without symptom match</p>
                  </div>
                  <div className="text-sm text-gray-700 bg-orange-50 p-3 rounded-lg">
                    <p className="font-semibold">Safety Threshold Exceeded</p>
                    <p className="text-xs text-gray-600 mt-1">High-risk recommendation without disclaimer</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  AI Performance Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Accuracy vs Doctor Diagnosis:</span>
                    <span className="font-bold text-green-600">87.5%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">False Positive Rate:</span>
                    <span className="font-bold text-yellow-600">2.3%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Safety Compliance:</span>
                    <span className="font-bold text-green-600">99.1%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Recent AI Audit Log</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">📋 2025-12-13 10:25 AM - Patient #2847 consultation reviewed - No issues</p>
                <p className="text-gray-700">⚠️ 2025-12-13 09:15 AM - Unusual recommendation pattern detected in consultation #2843</p>
                <p className="text-gray-700">✅ 2025-12-13 08:30 AM - Batch audit completed - 98 consultations verified</p>
                <p className="text-gray-700">📋 2025-12-12 11:45 PM - Daily AI performance report generated</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
