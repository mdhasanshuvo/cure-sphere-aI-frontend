import { useState } from 'react';
import {
  Activity,
  Calendar,
  FileText,
  Heart,
  MessageSquare,
  Clock,
  AlertCircle,
  TrendingUp,
  Pill,
  Stethoscope,
  Upload,
  ArrowRight
} from 'lucide-react';
import type { Page } from '../../App';

interface PatientDashboardProps {
  onNavigate: (page: Page) => void;
}

export function PatientDashboard({ onNavigate }: PatientDashboardProps) {
  const [showAIChat, setShowAIChat] = useState(false);

  // Mock data - will be replaced with API calls
  const stats = {
    activeSymptoms: 2,
    nextAppointment: 'Dec 15, 10:00 AM',
    pendingReports: 1,
    healthScore: 85
  };

  const recentTimeline = [
    {
      id: '1',
      type: 'ai_consultation' as const,
      date: 'Dec 12, 2025 - 10:30 AM',
      title: 'AI Consultation',
      description: 'Fever, Body ache',
      urgency: 'medium' as const,
      followUpDate: 'Dec 15, 2025'
    },
    {
      id: '2',
      type: 'lab_report' as const,
      date: 'Dec 10, 2025 - 2:00 PM',
      title: 'CBC Report',
      description: '2 abnormal markers detected',
      urgency: 'medium' as const
    },
    {
      id: '3',
      type: 'prescription' as const,
      date: 'Dec 05, 2025 - 11:00 AM',
      title: 'Doctor Prescription',
      description: 'Dr. Sarah Ahmed - Antibiotics',
      urgency: 'low' as const
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai_consultation':
        return <MessageSquare className="w-5 h-5" />;
      case 'lab_report':
        return <FileText className="w-5 h-5" />;
      case 'prescription':
        return <Pill className="w-5 h-5" />;
      case 'doctor_visit':
        return <Stethoscope className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ai_consultation':
        return 'blue';
      case 'lab_report':
        return 'purple';
      case 'prescription':
        return 'orange';
      case 'doctor_visit':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Health Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your health overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Symptoms */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                AI Tracked
              </div>
            </div>
            <div className="text-gray-900 mb-1">{stats.activeSymptoms}</div>
            <p className="text-gray-600">Active Symptoms</p>
          </div>

          {/* Next Appointment */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-gray-900 mb-1">{stats.nextAppointment}</div>
            <p className="text-gray-600">Next Appointment</p>
          </div>

          {/* Pending Reports */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              {stats.pendingReports > 0 && (
                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                  {stats.pendingReports}
                </div>
              )}
            </div>
            <div className="text-gray-900 mb-1">{stats.pendingReports}</div>
            <p className="text-gray-600">Pending Lab Reports</p>
          </div>

          {/* Health Score */}
          <div className="bg-gradient-to-br from-blue-600 to-green-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="mb-1">{stats.healthScore}/100</div>
            <p className="text-blue-100">Health Score</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Health Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Health Timeline</h2>
                <button className="text-blue-600 hover:text-blue-700 transition-colors">
                  View All →
                </button>
              </div>

              <div className="space-y-4">
                {recentTimeline.map((entry) => {
                  const typeColor = getTypeColor(entry.type);
                  const urgencyColor = getUrgencyColor(entry.urgency);

                  return (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-xl border-2 border-${typeColor}-100 bg-${typeColor}-50 hover:shadow-md transition-all cursor-pointer`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 bg-${typeColor}-200 rounded-xl flex items-center justify-center flex-shrink-0 text-${typeColor}-700`}>
                          {getTypeIcon(entry.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-900">{entry.title}</h3>
                            <div className={`px-3 py-1 bg-${urgencyColor}-100 text-${urgencyColor}-700 rounded-full`}>
                              {entry.urgency}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2">{entry.description}</p>
                          <div className="flex items-center gap-4 text-gray-500">
                            <span>{entry.date}</span>
                            {entry.followUpDate && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Follow-up: {entry.followUpDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* AI Consultation CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="mb-2">AI Doctor Available 24/7</h3>
              <p className="text-blue-100 mb-4">
                Get instant health guidance from our AI doctor
              </p>
              <button
                onClick={() => onNavigate('symptom-analyzer')}
                className="w-full px-6 py-3 bg-white text-blue-600 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Start Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('doctors')}
                  className="w-full p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors flex items-center gap-3"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                </button>
                <button
                  onClick={() => onNavigate('lab-reports')}
                  className="w-full p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors flex items-center gap-3"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Lab Report</span>
                </button>
                <button
                  onClick={() => onNavigate('pharmacy')}
                  className="w-full p-4 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors flex items-center gap-3"
                >
                  <Pill className="w-5 h-5" />
                  <span>Order Medicine</span>
                </button>
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 border-2 border-green-100">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-gray-900">Health Tip</h3>
              </div>
              <p className="text-gray-600">
                Drink 8-10 glasses of water daily to stay hydrated and maintain optimal health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
