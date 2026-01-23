import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Droplet, Ruler, Weight, Save, Edit2, CheckCircle, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Page } from '../App';

interface UserProfileProps {
  onNavigate: (page: Page) => void;
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    height: user?.height.toString() || '',
    weight: user?.weight.toString() || '',
    division: user?.location.division || '',
    district: user?.location.district || '',
    area: user?.location.area || '',
    medicalHistory: user?.medicalHistory || '',
    allergies: user?.allergies || '',
    isDonor: user?.isDonor || false,
    lastDonationDate: user?.lastDonationDate || '',
  });

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Please login to view your profile</p>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateUser({
      name: formData.name,
      phone: formData.phone,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      location: {
        division: formData.division,
        district: formData.district,
        area: formData.area,
      },
      medicalHistory: formData.medicalHistory,
      allergies: formData.allergies,
      isDonor: formData.isDonor,
      lastDonationDate: formData.lastDonationDate,
    });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const calculateAge = () => {
    const today = new Date();
    const birthDate = new Date(user.birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = () => {
    const heightInMeters = user.height / 100;
    const bmi = user.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-yellow-600' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-orange-600' };
    return { text: 'Obese', color: 'text-red-600' };
  };

  const bmi = parseFloat(calculateBMI());
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal and medical information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Edit2 className="w-5 h-5" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700">Profile updated successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={user.birthdate}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Blood Group</label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={user.bloodGroup}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Age</label>
                <input
                  type="text"
                  value={`${calculateAge()} years`}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Physical Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-900 mb-6">Physical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Height (cm)</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Weight (kg)</label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-900 mb-6">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Division</label>
                <input
                  type="text"
                  value={formData.division}
                  onChange={(e) => handleChange('division', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Area</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleChange('area', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-900 mb-6">Medical Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Medical History</label>
                <textarea
                  value={formData.medicalHistory}
                  onChange={(e) => handleChange('medicalHistory', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Allergies</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => handleChange('allergies', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Blood Donor Section */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-6 h-6 text-red-600" />
              <h3 className="text-gray-900">Blood Donor Status</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDonor}
                  onChange={(e) => handleChange('isDonor', e.target.checked)}
                  disabled={!isEditing}
                  className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 disabled:opacity-50"
                />
                <span className="text-gray-700">I am available as a blood donor</span>
              </label>

              {formData.isDonor && (
                <div>
                  <label className="block text-gray-700 mb-2">Last Donation Date</label>
                  <input
                    type="date"
                    value={formData.lastDonationDate}
                    onChange={(e) => handleChange('lastDonationDate', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50"
                  />
                </div>
              )}

              <p className="text-gray-600">
                By enabling this, you'll appear in the Blood Bank search results for people needing your blood group.
              </p>
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name,
                    phone: user.phone,
                    height: user.height.toString(),
                    weight: user.weight.toString(),
                    division: user.location.division,
                    district: user.location.district,
                    area: user.location.area,
                    medicalHistory: user.medicalHistory || '',
                    allergies: user.allergies || '',
                    isDonor: user.isDonor,
                    lastDonationDate: user.lastDonationDate || '',
                  });
                }}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Health Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-900 mb-4">Health Stats</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-600 mb-1">BMI</p>
                <p className="text-gray-900">{bmi}</p>
                <p className={`${bmiCategory.color}`}>{bmiCategory.text}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-gray-600 mb-1">Age</p>
                <p className="text-gray-900">{calculateAge()} years</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-gray-600 mb-1">Blood Group</p>
                <p className="text-gray-900">{user.bloodGroup}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                View Dashboard
              </button>
              <button
                onClick={() => onNavigate('blood-bank')}
                className="w-full px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                Blood Bank
              </button>
              <button
                onClick={() => onNavigate('symptom-analyzer')}
                className="w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                Check Symptoms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
