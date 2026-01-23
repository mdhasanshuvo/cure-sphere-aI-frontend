import { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, Calendar, Droplet, Ruler, Weight, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Page } from '../App';

interface SignUpProps {
  onNavigate: (page: Page) => void;
}

export function SignUp({ onNavigate }: SignUpProps) {
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | 'admin'>('patient');

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthdate: '',
    bloodGroup: 'A+' as const,
    height: '',
    weight: '',
    division: '',
    district: '',
    area: '',
    medicalHistory: '',
    allergies: '',
    // Doctor-specific fields
    specialization: '',
    qualification: '',
    licenseNumber: '',
    experience: '',
    consultationFee: '',
    // Admin-specific fields
    adminLevel: 'moderator',
    department: '',
  });

  const divisions = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (userRole === 'patient') {
      if (!formData.birthdate || !formData.height || !formData.weight || !formData.division || !formData.district || !formData.area) {
        setError('Please fill in all required fields');
        return false;
      }
      const age = new Date().getFullYear() - new Date(formData.birthdate).getFullYear();
      if (age < 1 || age > 120) {
        setError('Please enter a valid birthdate');
        return false;
      }
    } else if (userRole === 'doctor') {
      if (!formData.specialization || !formData.qualification || !formData.licenseNumber || !formData.experience || !formData.consultationFee) {
        setError('Please fill in all required fields for doctor');
        return false;
      }
    } else if (userRole === 'admin') {
      if (!formData.adminLevel || !formData.department) {
        setError('Please fill in all required fields for admin');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setError('');

    try {
      let userData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: userRole,
      };

      // Add role-specific fields
      if (userRole === 'patient') {
        userData = {
          ...userData,
          birthdate: formData.birthdate,
          bloodGroup: formData.bloodGroup,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          location: {
            division: formData.division,
            district: formData.district,
            area: formData.area,
          },
          medicalHistory: formData.medicalHistory,
          allergies: formData.allergies,
        };
      } else if (userRole === 'doctor') {
        userData = {
          ...userData,
          specialization: formData.specialization,
          qualification: formData.qualification,
          licenseNumber: formData.licenseNumber,
          experience: parseInt(formData.experience),
          consultationFee: parseInt(formData.consultationFee),
          videoConsultation: true,
        };
      } else if (userRole === 'admin') {
        userData = {
          ...userData,
          adminLevel: formData.adminLevel,
          department: formData.department,
        };
      }

      const success = await signup(userData, formData.password);
      if (success) {
        onNavigate('dashboard');
      } else {
        setError('Email already exists. Please use a different email.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-320px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600">Join CureSphere AI for comprehensive healthcare support</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Step {step} of 2</span>
              <span className="text-gray-600">{step === 1 ? 'Account Details' : 'Medical Information'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-gray-700 mb-3 font-semibold">Select Your Role *</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setUserRole('patient')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        userRole === 'patient'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-white hover:border-blue-300'
                      }`}
                    >
                      <User className="w-6 h-6 mx-auto mb-2" />
                      <p className="font-medium">Patient</p>
                      <p className="text-xs text-gray-500">Get healthcare</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserRole('doctor')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        userRole === 'doctor'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-white hover:border-blue-300'
                      }`}
                    >
                      <User className="w-6 h-6 mx-auto mb-2" />
                      <p className="font-medium">Doctor</p>
                      <p className="text-xs text-gray-500">Provide care</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserRole('admin')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        userRole === 'admin'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-white hover:border-blue-300'
                      }`}
                    >
                      <User className="w-6 h-6 mx-auto mb-2" />
                      <p className="font-medium">Admin</p>
                      <p className="text-xs text-gray-500">Manage system</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+880 1700-000000"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        placeholder="Min. 6 characters"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        placeholder="Re-enter password"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Next Step
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Patient Fields */}
                {userRole === 'patient' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Date of Birth *</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            value={formData.birthdate}
                            onChange={(e) => handleChange('birthdate', e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Blood Group *</label>
                        <div className="relative">
                          <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            value={formData.bloodGroup}
                            onChange={(e) => handleChange('bloodGroup', e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                          >
                            {bloodGroups.map(bg => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Height (cm) *</label>
                        <div className="relative">
                          <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={formData.height}
                            onChange={(e) => handleChange('height', e.target.value)}
                            placeholder="170"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                    <label className="block text-gray-700 mb-2">Weight (kg) *</label>
                    <div className="relative">
                      <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleChange('weight', e.target.value)}
                        placeholder="65"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Location *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={formData.division}
                        onChange={(e) => handleChange('division', e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                      >
                        <option value="">Division</option>
                        {divisions.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => handleChange('district', e.target.value)}
                      placeholder="District"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => handleChange('area', e.target.value)}
                      placeholder="Area"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Medical History (Optional)</label>
                  <textarea
                    value={formData.medicalHistory}
                    onChange={(e) => handleChange('medicalHistory', e.target.value)}
                    placeholder="Any chronic conditions, past surgeries, etc."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                  </>
                )}

                {/* Doctor Fields */}
                {userRole === 'doctor' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Specialization *</label>
                        <select
                          value={formData.specialization}
                          onChange={(e) => handleChange('specialization', e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Specialization</option>
                          <option>General Physician</option>
                          <option>Cardiologist</option>
                          <option>Neurologist</option>
                          <option>Orthopedic Surgeon</option>
                          <option>Dermatologist</option>
                          <option>Pediatrician</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Qualification *</label>
                        <input
                          type="text"
                          value={formData.qualification}
                          onChange={(e) => handleChange('qualification', e.target.value)}
                          placeholder="MBBS, MD, etc."
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">License Number *</label>
                        <input
                          type="text"
                          value={formData.licenseNumber}
                          onChange={(e) => handleChange('licenseNumber', e.target.value)}
                          placeholder="BMDC-001"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Experience (Years) *</label>
                        <input
                          type="number"
                          value={formData.experience}
                          onChange={(e) => handleChange('experience', e.target.value)}
                          placeholder="10"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Consultation Fee (৳) *</label>
                      <input
                        type="number"
                        value={formData.consultationFee}
                        onChange={(e) => handleChange('consultationFee', e.target.value)}
                        placeholder="1200"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                {/* Admin Fields */}
                {userRole === 'admin' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Admin Level *</label>
                        <select
                          value={formData.adminLevel}
                          onChange={(e) => handleChange('adminLevel', e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="moderator">Moderator</option>
                          <option value="support">Support</option>
                          <option value="super-admin">Super Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Department *</label>
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) => handleChange('department', e.target.value)}
                          placeholder="e.g., User Management"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-gray-700 mb-2">Allergies (Optional)</label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                    placeholder="Food allergies, drug allergies, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-blue-600 hover:text-blue-700"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
