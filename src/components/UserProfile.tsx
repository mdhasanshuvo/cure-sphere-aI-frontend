import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Droplet, Ruler, Weight, Save, Edit2, CheckCircle, Heart, Loader2, AlertCircle, TrendingUp, Activity, Shield, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Page } from '../App';

interface UserProfileProps {
  onNavigate: (page: Page) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export function UserProfile({ onNavigate }: UserProfileProps) {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    height: '',
    weight: '',
    division: '',
    district: '',
    area: '',
    medicalHistory: '',
    allergies: '',
    isDonor: false,
    lastDonationDate: '',
  });

  // Fetch user profile from database on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/users/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfileData(data);
        
        // Initialize form data with database values
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          height: data.height?.toString() || '',
          weight: data.weight?.toString() || '',
          division: data.location?.division || '',
          district: data.location?.district || '',
          area: data.location?.area || '',
          medicalHistory: data.medicalHistory || '',
          allergies: data.allergies || '',
          isDonor: data.isDonor || false,
          lastDonationDate: data.lastDonationDate || '',
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?._id]);

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
    // Clear validation error for this field
    setValidationErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (formData.phone && !/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (formData.height && (parseFloat(formData.height) < 50 || parseFloat(formData.height) > 250)) {
      errors.height = 'Height must be between 50 and 250 cm';
    }
    if (formData.weight && (parseFloat(formData.weight) < 20 || parseFloat(formData.weight) > 300)) {
      errors.weight = 'Weight must be between 20 and 300 kg';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const updatedData = {
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
      };

      // Update in database
      await updateUser(updatedData);
      
      // Refresh profile data from database
      const response = await fetch(`${API_BASE_URL}/api/users/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }

      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = () => {
    if (!profileData.birthdate) return 0;
    const today = new Date();
    const birthDate = new Date(profileData.birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = () => {
    if (!profileData.height || !profileData.weight) return 0;
    const heightInMeters = profileData.height / 100;
    const bmi = profileData.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600', bg: 'bg-green-50' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'Obese', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 9;
    
    if (formData.name) completed++;
    if (formData.phone) completed++;
    if (formData.height) completed++;
    if (formData.weight) completed++;
    if (formData.division) completed++;
    if (formData.medicalHistory) completed++;
    if (profileData?.bloodGroup) completed++;
    if (profileData?.birthdate) completed++;
    if (formData.isDonor) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const getProfileCompletionColor = (percentage: number) => {
    if (percentage < 33) return 'bg-red-500';
    if (percentage < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const bmi = parseFloat(calculateBMI());
  const bmiCategory = getBMICategory(bmi);
  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your personal and medical information</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Edit2 className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Profile Completion Progress */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-md p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-900 font-bold text-lg flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span>Profile Completion</span>
              </p>
              <p className="text-gray-600 text-sm mt-1">Complete all fields to maximize your profile visibility</p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${getProfileCompletionColor(profileCompletion)} bg-white px-4 py-2 rounded-lg`}>
                {profileCompletion}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden shadow-sm">
            <div 
              className={`h-4 rounded-full transition-all duration-500 bg-gradient-to-r ${
                profileCompletion < 33 ? 'from-red-400 to-red-600' :
                profileCompletion < 66 ? 'from-yellow-400 to-orange-500' :
                'from-green-400 to-green-600'
              }`}
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <p className="text-red-600 font-semibold">0-33%</p>
              <p className="text-gray-600">Getting Started</p>
            </div>
            <div className="text-center">
              <p className="text-yellow-600 font-semibold">34-66%</p>
              <p className="text-gray-600">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-green-600 font-semibold">67-100%</p>
              <p className="text-gray-600">Complete</p>
            </div>
          </div>
        </div>
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
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <User className="w-6 h-6 text-blue-500" />
              <span>Personal Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 transition ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {validationErrors.name && <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={profileData?.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 transition ${
                      validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {validationErrors.phone && <p className="text-red-600 text-sm mt-1">{validationErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profileData?.birthdate || 'Not set'}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Blood Group</label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                  <input
                    type="text"
                    value={profileData?.bloodGroup || 'Not set'}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Age</label>
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
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Activity className="w-6 h-6 text-green-500" />
              <span>Physical Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Height (cm)</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 transition ${
                      validationErrors.height ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {validationErrors.height && <p className="text-red-600 text-sm mt-1">{validationErrors.height}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Weight (kg)</label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 transition ${
                      validationErrors.weight ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {validationErrors.weight && <p className="text-red-600 text-sm mt-1">{validationErrors.weight}</p>}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-purple-500" />
              <span>Location</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Division</label>
                <input
                  type="text"
                  value={formData.division}
                  onChange={(e) => handleChange('division', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Area</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleChange('area', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 transition"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Shield className="w-6 h-6 text-indigo-500" />
              <span>Medical Information</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Medical History</label>
                <textarea
                  value={formData.medicalHistory}
                  onChange={(e) => handleChange('medicalHistory', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="e.g., Diabetes, Hypertension, Asthma, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 transition"
                />
                <p className="text-gray-500 text-sm mt-1">Help us understand your medical background</p>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Allergies</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => handleChange('allergies', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., Penicillin, Peanuts, Shellfish, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 transition"
                />
                <p className="text-gray-500 text-sm mt-1">List any known allergies</p>
              </div>
            </div>
          </div>

          {/* Blood Donor Section */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-md p-6 border-2 border-red-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Heart className="w-6 h-6 text-red-600" />
              <span>Blood Donor Status</span>
            </h3>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-red-300 hover:shadow-md transition">
              <div className="flex items-center space-x-3 flex-1">
                <input
                  type="checkbox"
                  checked={formData.isDonor}
                  onChange={(e) => handleChange('isDonor', e.target.checked)}
                  disabled={!isEditing}
                  className="w-6 h-6 text-red-600 rounded accent-red-600 cursor-pointer disabled:opacity-50"
                />
                <div>
                  <label className="text-gray-900 font-semibold cursor-pointer">
                    Register as Blood Donor
                  </label>
                  <p className="text-gray-600 text-sm mt-1">Help save lives by donating blood</p>
                </div>
              </div>
              <span className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${formData.isDonor ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {formData.isDonor ? 'Active' : 'Inactive'}
              </span>
            </div>

            {formData.isDonor && (
              <div className="mt-4 p-4 bg-white rounded-lg border-l-4 border-red-600">
                <p className="text-gray-700 font-semibold mb-3">Last Donation Date</p>
                <input
                  type="date"
                  value={formData.lastDonationDate}
                  onChange={(e) => handleChange('lastDonationDate', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 disabled:bg-gray-50"
                />
                <p className="text-gray-600 text-xs mt-2">🩸 We recommend donating every 3 months for optimal health</p>
              </div>
            )}

            <div className="mt-4 p-4 bg-white rounded-lg border-l-4 border-blue-600">
              <p className="text-gray-600 text-sm">
                <Shield className="inline w-4 h-4 mr-2 text-blue-600" />
                Your blood donor information is kept confidential and secure.
              </p>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: profileData.name || '',
                    phone: profileData.phone || '',
                    height: profileData.height?.toString() || '',
                    weight: profileData.weight?.toString() || '',
                    division: profileData.location?.division || '',
                    district: profileData.location?.district || '',
                    area: profileData.location?.area || '',
                    medicalHistory: profileData.medicalHistory || '',
                    allergies: profileData.allergies || '',
                    isDonor: profileData.isDonor || false,
                    lastDonationDate: profileData.lastDonationDate || '',
                  });
                  setValidationErrors({});
                }}
                className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <X className="w-5 h-5 group-hover:text-red-500" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Health Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <span>Health Stats</span>
            </h3>
            <div className="space-y-4">
              <div className={`p-5 rounded-lg border-2 border-blue-200 ${bmi ? bmiCategory.bg : 'bg-gray-50'}`}>
                <p className="text-gray-600 text-sm mb-1">BMI (Body Mass Index)</p>
                <p className="text-3xl font-bold text-gray-900">{bmi || '--'}</p>
                <p className={`${bmiCategory.color} font-semibold mt-2`}>{bmiCategory.text}</p>
                <p className="text-gray-500 text-xs mt-2">Weight (kg) / Height² (m²)</p>
              </div>

              <div className="p-5 bg-green-50 rounded-lg border-2 border-green-200">
                <p className="text-gray-600 text-sm mb-1">Age</p>
                <p className="text-3xl font-bold text-gray-900">{calculateAge()}</p>
                <p className="text-green-600 font-semibold mt-2">years</p>
              </div>

              <div className="p-5 bg-red-50 rounded-lg border-2 border-red-200">
                <p className="text-gray-600 text-sm mb-1">Blood Group</p>
                <p className="text-3xl font-bold text-gray-900">{profileData?.bloodGroup || '--'}</p>
                <p className="text-red-600 font-semibold mt-2">Group Type</p>
              </div>

              <div className="p-5 bg-purple-50 rounded-lg border-2 border-purple-200">
                <p className="text-gray-600 text-sm mb-1">Donor Status</p>
                <p className="text-2xl font-bold text-gray-900">{formData.isDonor ? 'Active' : 'Inactive'}</p>
                <p className={`${formData.isDonor ? 'text-red-600' : 'text-gray-600'} font-semibold mt-2`}>
                  {formData.isDonor ? 'Blood Donor' : 'Not a Donor'}
                </p>
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
