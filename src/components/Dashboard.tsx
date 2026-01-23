import { Activity, Calendar, FileText, Pill, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import type { Page } from '../App';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const stats = [
    { label: 'Total Consultations', value: '8', icon: Activity, color: 'from-blue-500 to-blue-600' },
    { label: 'Pending Appointments', value: '2', icon: Calendar, color: 'from-green-500 to-green-600' },
    { label: 'Lab Reports', value: '5', icon: FileText, color: 'from-purple-500 to-purple-600' },
    { label: 'Active Prescriptions', value: '3', icon: Pill, color: 'from-orange-500 to-orange-600' },
  ];

  const recentActivities = [
    {
      type: 'consultation',
      title: 'Video Consultation with Dr. Ahmed Rahman',
      date: 'Nov 25, 2025',
      time: '4:00 PM',
      status: 'Completed',
    },
    {
      type: 'lab-report',
      title: 'CBC Test Report Uploaded',
      date: 'Nov 23, 2025',
      time: '10:30 AM',
      status: 'Analyzed',
    },
    {
      type: 'medicine',
      title: 'Medicine Order Delivered',
      date: 'Nov 22, 2025',
      time: '6:45 PM',
      status: 'Delivered',
    },
    {
      type: 'appointment',
      title: 'Appointment Booked with Dr. Fatima Begum',
      date: 'Nov 20, 2025',
      time: '2:00 PM',
      status: 'Scheduled',
    },
  ];

  const upcomingAppointments = [
    {
      doctor: 'Dr. Fatima Begum',
      specialty: 'Cardiologist',
      date: 'Dec 1, 2025',
      time: '10:00 AM',
      type: 'Video Consultation',
    },
    {
      doctor: 'Dr. Karim Hassan',
      specialty: 'Neurologist',
      date: 'Dec 3, 2025',
      time: '2:00 PM',
      type: 'In-Person',
    },
  ];

  const activePrescriptions = [
    {
      medicine: 'Paracetamol 500mg',
      dosage: 'Every 6 hours',
      startDate: 'Nov 20, 2025',
      endDate: 'Nov 27, 2025',
      remaining: 2,
    },
    {
      medicine: 'Omeprazole 20mg',
      dosage: 'Before breakfast',
      startDate: 'Nov 15, 2025',
      endDate: 'Dec 15, 2025',
      remaining: 18,
    },
    {
      medicine: 'Cetirizine 10mg',
      dosage: 'Once daily',
      startDate: 'Nov 22, 2025',
      endDate: 'Nov 29, 2025',
      remaining: 5,
    },
  ];

  const healthMetrics = [
    { name: 'Blood Pressure', value: '120/80', status: 'Normal', date: 'Nov 25, 2025' },
    { name: 'Blood Sugar', value: '95 mg/dL', status: 'Normal', date: 'Nov 23, 2025' },
    { name: 'Heart Rate', value: '72 bpm', status: 'Normal', date: 'Nov 25, 2025' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Health Dashboard</h1>
        <p className="text-gray-600">Your comprehensive health overview and activity tracking</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-gray-600 mb-1">{stat.label}</p>
              <p className="text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900">Upcoming Appointments</h3>
            <button
              onClick={() => onNavigate('doctors')}
              className="text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((apt, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">{apt.doctor}</p>
                    <p className="text-gray-600 mb-2">{apt.specialty}</p>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{apt.date}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{apt.time}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {apt.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Metrics */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-900 mb-6">Health Metrics</h3>
          <div className="space-y-4">
            {healthMetrics.map((metric, idx) => (
              <div key={idx} className="pb-4 border-b border-gray-200 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-700">{metric.name}</p>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {metric.status}
                  </span>
                </div>
                <p className="text-gray-900 mb-1">{metric.value}</p>
                <p className="text-gray-500">{metric.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Active Prescriptions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900">Active Prescriptions</h3>
            <button
              onClick={() => onNavigate('pharmacy')}
              className="text-blue-600 hover:text-blue-700"
            >
              Order More
            </button>
          </div>
          <div className="space-y-4">
            {activePrescriptions.map((rx, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">{rx.medicine}</p>
                    <p className="text-gray-600 mb-2">{rx.dosage}</p>
                    <p className="text-gray-500">
                      {rx.startDate} - {rx.endDate}
                    </p>
                  </div>
                  <Pill className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                  <span className="text-gray-600">Days remaining:</span>
                  <span className={`px-3 py-1 rounded-full ${
                    rx.remaining <= 3 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {rx.remaining} days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'consultation' ? 'bg-blue-100' :
                  activity.type === 'lab-report' ? 'bg-purple-100' :
                  activity.type === 'medicine' ? 'bg-green-100' :
                  'bg-orange-100'
                }`}>
                  {activity.type === 'consultation' && <Activity className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'lab-report' && <FileText className="w-5 h-5 text-purple-600" />}
                  {activity.type === 'medicine' && <Pill className="w-5 h-5 text-green-600" />}
                  {activity.type === 'appointment' && <Calendar className="w-5 h-5 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">{activity.title}</p>
                  <p className="text-gray-600">{activity.date} at {activity.time}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-3 mb-4">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-gray-900 mb-2">Quick Actions</h3>
            <p className="text-gray-600 mb-4">Need medical assistance? Get started with these options:</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('symptom-analyzer')}
            className="px-4 py-3 bg-white text-gray-900 rounded-lg hover:shadow-md transition-all"
          >
            Check Symptoms
          </button>
          <button
            onClick={() => onNavigate('pharmacy')}
            className="px-4 py-3 bg-white text-gray-900 rounded-lg hover:shadow-md transition-all"
          >
            Order Medicines
          </button>
          <button
            onClick={() => onNavigate('lab-reports')}
            className="px-4 py-3 bg-white text-gray-900 rounded-lg hover:shadow-md transition-all"
          >
            Upload Lab Report
          </button>
          <button
            onClick={() => onNavigate('doctors')}
            className="px-4 py-3 bg-white text-gray-900 rounded-lg hover:shadow-md transition-all"
          >
            Book Doctor
          </button>
        </div>
      </div>
    </div>
  );
}
