import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Video, Calendar, Clock, Award, Globe, Filter, ChevronDown, Loader } from 'lucide-react';
import { doctors as doctorsAPI } from '../services/mongoApi';

export function DoctorConsultation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [consultationType, setConsultationType] = useState('all');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const specialties = [
    'all',
    'General Physician',
    'Cardiologist',
    'Neurologist',
    'Endocrinologist',
    'Gastroenterologist',
    'Dermatologist',
    'Pediatrician',
    'Orthopedic',
  ];

  // Fetch doctors from database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await doctorsAPI.getAll(1, 100) as any;
        setDoctors(response?.doctors || []);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
        setError('Failed to load doctors. Using sample data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors
    .filter(d => selectedSpecialty === 'all' || d.specialization === selectedSpecialty)
    .filter(d => consultationType === 'all' || 
      (consultationType === 'video' && d.videoConsultation) ||
      (consultationType === 'international' && d.internationalConsultation))
    .filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleBookAppointment = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setShowBooking(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Find Specialist Doctors</h1>
        <p className="text-gray-600">Connect with nearby specialists or book virtual consultations (national/international)</p>
        {error && <p className="text-orange-600 mt-2">{error}</p>}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctor, specialty, or hospital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              {specialties.map(s => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All Specialties' : s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={consultationType}
              onChange={(e) => setConsultationType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="video">Video Available</option>
              <option value="international">International</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"
                  alt={doctor.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-gray-900">{doctor.name}</h3>
                    {doctor.internationalConsultation && (
                      <Globe className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-gray-700 mb-1">{doctor.specialization}</p>
                  <p className="text-gray-600 mb-2">{doctor.qualification}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-700">{doctor.rating || 4.5}</span>
                      <span className="text-gray-500">({doctor.reviews || 0})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Award className="w-4 h-4" />
                      <span>{doctor.experience || 0} years</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{doctor.hospitalName || 'Hospital'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Next Available: {doctor.nextAvailable || 'Check availability'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Consultation Fee:</span>
                  <span className="text-gray-900">৳{doctor.consultationFee || 0}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {doctor.videoConsultation && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center space-x-1">
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </span>
                )}
                {doctor.internationalConsultation && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>International</span>
                  </span>
                )}
                {doctor.languages?.map((lang: string) => (
                  <span key={lang} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {lang}
                  </span>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleBookAppointment(doctor._id)}
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                </button>
                {doctor.videoConsultation && (
                  <button className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
                    <Video className="w-5 h-5" />
                    <span>Video Call</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No doctors found matching your criteria</p>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && selectedDoctorId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-4">Book Appointment</h3>
            <p className="text-gray-600 mb-6">
              Booking with {doctors.find(d => d._id === selectedDoctorId)?.name}
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Select Time</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>10:00 AM</option>
                  <option>2:00 PM</option>
                  <option>4:00 PM</option>
                  <option>6:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Consultation Type</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>In-Person</option>
                  <option>Video Consultation</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowBooking(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
