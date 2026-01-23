import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Video, Calendar, Clock, Award, Globe, Filter, ChevronDown, Phone, Loader } from 'lucide-react';
import { doctors as doctorsAPI } from '../services/mongoApi';

export function DoctorConsultation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [consultationType, setConsultationType] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
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
        const response = await doctorsAPI.getAll(1, 100);
        setDoctors(response.doctors || []);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
        setError('Failed to load doctors. Please try again later.');
        // Fallback to sample data
        const fallbackDoctors = [
    {
      id: 1,
      name: 'Dr. Ahmed Rahman',
      specialty: 'General Physician',
      qualification: 'MBBS, FCPS (Medicine)',
      experience: 15,
      rating: 4.8,
      reviews: 342,
      hospital: 'Square Hospital, Dhaka',
      location: 'Panthapath, Dhaka',
      consultationFee: 1200,
      videoConsultation: true,
      internationalConsultation: false,
      availability: ['Mon', 'Wed', 'Fri'],
      nextAvailable: 'Today 4:00 PM',
      languages: ['Bangla', 'English'],
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    },
    {
      id: 2,
      name: 'Dr. Fatima Begum',
      specialty: 'Cardiologist',
      qualification: 'MBBS, MD (Cardiology), FACC',
      experience: 20,
      rating: 4.9,
      reviews: 567,
      hospital: 'United Hospital, Dhaka',
      location: 'Gulshan, Dhaka',
      consultationFee: 2500,
      videoConsultation: true,
      internationalConsultation: true,
      availability: ['Tue', 'Thu', 'Sat'],
      nextAvailable: 'Tomorrow 10:00 AM',
      languages: ['Bangla', 'English', 'Hindi'],
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    },
    {
      id: 3,
      name: 'Dr. Karim Hassan',
      specialty: 'Neurologist',
      qualification: 'MBBS, FCPS (Neurology)',
      experience: 12,
      rating: 4.7,
      reviews: 289,
      hospital: 'Apollo Hospital, Dhaka',
      location: 'Bashundhara, Dhaka',
      consultationFee: 2000,
      videoConsultation: true,
      internationalConsultation: false,
      availability: ['Mon', 'Tue', 'Thu'],
      nextAvailable: 'Dec 1, 2:00 PM',
      languages: ['Bangla', 'English'],
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    },
    {
      id: 4,
      name: 'Dr. Nusrat Jahan',
      specialty: 'Endocrinologist',
      qualification: 'MBBS, MRCP, MD (Endocrinology)',
      experience: 18,
      rating: 4.9,
      reviews: 421,
      hospital: 'BIRDEM Hospital, Dhaka',
      location: 'Shahbag, Dhaka',
      consultationFee: 1800,
      videoConsultation: true,
      internationalConsultation: true,
      availability: ['Mon', 'Wed', 'Fri', 'Sat'],
      nextAvailable: 'Today 6:00 PM',
      languages: ['Bangla', 'English'],
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    },
    {
      id: 5,
      name: 'Dr. Mehedi Hasan',
      specialty: 'Gastroenterologist',
      qualification: 'MBBS, FCPS (Gastroenterology)',
      experience: 10,
      rating: 4.6,
      reviews: 178,
      hospital: 'Popular Medical Centre',
      location: 'Dhanmondi, Dhaka',
      consultationFee: 1500,
      videoConsultation: true,
      internationalConsultation: false,
      availability: ['Tue', 'Thu', 'Sat'],
      nextAvailable: 'Tomorrow 3:00 PM',
      languages: ['Bangla', 'English'],
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    },
    {
      id: 6,
      name: 'Dr. Sarah Thompson (International)',
      specialty: 'Dermatologist',
      qualification: 'MD, Board Certified Dermatologist',
      experience: 22,
      rating: 5.0,
      reviews: 892,
      hospital: 'Mayo Clinic, USA',
      location: 'Rochester, Minnesota, USA',
      consultationFee: 5000,
      videoConsultation: true,
      internationalConsultation: true,
      availability: ['Mon', 'Wed', 'Fri'],
      nextAvailable: 'Dec 2, 9:00 PM (BD Time)',
      languages: ['English'],
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400',
    },
        ];
        setDoctors(fallbackDoctors);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors
    .filter(d => selectedSpecialty === 'all' || d.specialty === selectedSpecialty)
    .filter(d => consultationType === 'all' || 
      (consultationType === 'video' && d.videoConsultation) ||
      (consultationType === 'international' && d.internationalConsultation))
    .filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hospital.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleBookAppointment = (doctorId: number) => {
    setSelectedDoctor(doctorId);
    setShowBooking(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Find Specialist Doctors</h1>
        <p className="text-gray-600">Connect with nearby specialists or book virtual consultations (national/international)</p>
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
          <div key={doctor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={doctor.image}
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
                  <p className="text-gray-700 mb-1">{doctor.specialty}</p>
                  <p className="text-gray-600 mb-2">{doctor.qualification}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-700">{doctor.rating}</span>
                      <span className="text-gray-500">({doctor.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Award className="w-4 h-4" />
                      <span>{doctor.experience} years</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{doctor.hospital}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Next Available: {doctor.nextAvailable}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Consultation Fee:</span>
                  <span className="text-gray-900">৳{doctor.consultationFee}</span>
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
                {doctor.languages.map((lang) => (
                  <span key={lang} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {lang}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <span className="text-gray-600">Available:</span>
                <div className="flex space-x-1">
                  {doctor.availability.map((day) => (
                    <span key={day} className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleBookAppointment(doctor.id)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                </button>
                {doctor.videoConsultation && (
                  <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                    <Video className="w-5 h-5" />
                    <span>Video Call</span>
                  </button>
                )}
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  View Profile
                </button>
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
      {showBooking && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-4">Book Appointment</h3>
            <p className="text-gray-600 mb-6">
              Booking with {doctors.find(d => d.id === selectedDoctor)?.name}
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
