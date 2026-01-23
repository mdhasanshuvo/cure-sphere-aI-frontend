import { useState, useEffect } from 'react';
import { Users, Calendar, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import type { User } from '../../types';

interface DoctorDashboardProps {
  user: User;
  onNavigate?: (page: string) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export function DoctorDashboard({ user }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'appointments' | 'ai-insights'>('overview');
  const [loading, setLoading] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [healthReports, setHealthReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch doctor's profile
        const profileResponse = await fetch(`${API_BASE_URL}/api/users/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setDoctorProfile(profileData);
        }

        // Fetch health reports where this doctor is assigned
        const reportsResponse = await fetch(`${API_BASE_URL}/api/health-reports?doctorId=${user._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (reportsResponse.ok) {
          const reportsData = await reportsResponse.json();
          setHealthReports(reportsData.reports || reportsData || []);
        }
      } catch (err) {
        console.error('Error fetching doctor data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Calculate real data from health reports
  const MOCK_APPOINTMENTS_TODAY = healthReports.filter(r => 
    r.reportType === 'appointment' && 
    new Date(r.followUpDate).toDateString() === new Date().toDateString()
  ).map(r => ({
    id: r._id,
    patientName: r.userId?.name || 'Patient',
    time: new Date(r.followUpDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    type: 'Consultation'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dr. {user.name} 👨‍⚕️</h1>
          <p className="text-gray-600">{user.specialization} | {user.totalPatients || 0} Patients</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {['overview', 'patients', 'appointments', 'ai-insights'].map((tab) => (
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
              {tab === 'patients' && 'My Patients'}
              {tab === 'appointments' && 'Appointments'}
              {tab === 'ai-insights' && 'AI Insights'}
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
                <h3 className="text-gray-600 text-sm font-medium mb-1">Total Patients</h3>
                <p className="text-3xl font-bold text-gray-900">{user.totalPatients || 0}</p>
                <p className="text-xs text-gray-500 mt-2">Lifetime registrations</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Today</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Today's Appointments</h3>
                <p className="text-3xl font-bold text-gray-900">{MOCK_APPOINTMENTS_TODAY.length}</p>
                <p className="text-xs text-gray-500 mt-2">Scheduled consultations</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Pending</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Lab Reviews</h3>
                <p className="text-3xl font-bold text-gray-900">5</p>
                <p className="text-xs text-gray-500 mt-2">Awaiting interpretation</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Urgent</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">AI Flagged Cases</h3>
                <p className="text-3xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-500 mt-2">Requiring attention</p>
              </div>
            </div>

            {/* Today's Schedule */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
              <div className="space-y-3">
                {MOCK_APPOINTMENTS_TODAY.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{apt.patientName}</h3>
                      <p className="text-sm text-gray-600">{apt.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{apt.time}</p>
                      <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 mt-1">Start Call</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Earnings Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                  <p className="text-green-100 text-sm mb-1">This Month</p>
                  <p className="text-4xl font-bold">৳25,500</p>
                  <p className="text-green-100 text-sm mt-2">25 consultations</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                  <p className="text-blue-100 text-sm mb-1">This Week</p>
                  <p className="text-4xl font-bold">৳8,200</p>
                  <p className="text-blue-100 text-sm mt-2">8 consultations</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                  <p className="text-purple-100 text-sm mb-1">Today</p>
                  <p className="text-4xl font-bold">৳1,200</p>
                  <p className="text-purple-100 text-sm mt-2">1 consultation</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Patients</h2>
            <div className="space-y-4">
              {MOCK_PATIENTS.map((patient) => (
                <div key={patient.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Age: {patient.age} | Last visit: {patient.lastVisit}</p>
                      <p className="text-sm text-gray-700 font-semibold mt-2">Current: {patient.condition}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        patient.urgency === 'high' ? 'bg-red-100 text-red-700' :
                        patient.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {patient.urgency}
                      </span>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-gray-600">Appointment calendar and management coming soon...</p>
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'ai-insights' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Highlighted Cases
                </h3>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-700">Patient with 5+ days fever requires urgent tests</li>
                  <li className="text-sm text-gray-700">Abnormal CBC results detected in recent report</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  AI Suggestions
                </h3>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-700">✓ Recommend dengue test for fever cases &gt; 3 days</li>
                  <li className="text-sm text-gray-700">✓ Schedule follow-ups for hypertension patients</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
