import { useState, useEffect } from 'react';
import { Search, Droplet, Phone, MapPin, User, Calendar, Heart, Filter, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { BloodDonor } from '../types';
import type { Page } from '../App';

interface BloodBankProps {
  onNavigate: (page: Page) => void;
}

export function BloodBank({ onNavigate }: BloodBankProps) {
  const { user } = useAuth();
  const [searchBloodGroup, setSearchBloodGroup] = useState('');
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<BloodDonor[]>([]);
  const [selectedDivision, setSelectedDivision] = useState('all');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const divisions = ['all', 'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'];

  // Mock donors data
  useEffect(() => {
    const mockDonors: BloodDonor[] = [
      {
        id: '1',
        name: 'Karim Ahmed',
        bloodGroup: 'O+',
        phone: '+880 1711-111111',
        location: { division: 'Dhaka', district: 'Dhaka', area: 'Dhanmondi' },
        lastDonationDate: '2024-06-15',
        age: 28,
        height: 175,
        weight: 72,
        physicalCondition: 'Healthy, exercises regularly, no chronic conditions',
        distance: 1.2,
      },
      {
        id: '2',
        name: 'Fatima Rahman',
        bloodGroup: 'A+',
        phone: '+880 1722-222222',
        location: { division: 'Dhaka', district: 'Dhaka', area: 'Gulshan' },
        lastDonationDate: '2024-07-20',
        age: 25,
        height: 162,
        weight: 58,
        physicalCondition: 'Excellent health, regular donor, active lifestyle',
        distance: 2.5,
      },
      {
        id: '3',
        name: 'Rashid Hassan',
        bloodGroup: 'B+',
        phone: '+880 1733-333333',
        location: { division: 'Dhaka', district: 'Dhaka', area: 'Uttara' },
        lastDonationDate: '2024-05-10',
        age: 32,
        height: 180,
        weight: 78,
        physicalCondition: 'Good health, donated 5+ times, no medical issues',
        distance: 4.8,
      },
      {
        id: '4',
        name: 'Ayesha Begum',
        bloodGroup: 'AB+',
        phone: '+880 1744-444444',
        location: { division: 'Dhaka', district: 'Dhaka', area: 'Mirpur' },
        lastDonationDate: '2024-08-01',
        age: 30,
        height: 165,
        weight: 62,
        physicalCondition: 'Healthy, vegetarian, regular health checkups',
        distance: 3.2,
      },
      {
        id: '5',
        name: 'Tanvir Islam',
        bloodGroup: 'O-',
        phone: '+880 1755-555555',
        location: { division: 'Dhaka', district: 'Dhaka', area: 'Banani' },
        lastDonationDate: '2024-06-25',
        age: 27,
        height: 178,
        weight: 75,
        physicalCondition: 'Very fit, athlete, universal donor',
        distance: 2.1,
      },
      {
        id: '6',
        name: 'Nusrat Jahan',
        bloodGroup: 'A-',
        phone: '+880 1766-666666',
        location: { division: 'Chittagong', district: 'Chittagong', area: 'Agrabad' },
        lastDonationDate: '2024-07-05',
        age: 26,
        height: 160,
        weight: 55,
        physicalCondition: 'Healthy, regular donor, no allergies',
        distance: 245.0,
      },
      {
        id: '7',
        name: 'Mahbub Alam',
        bloodGroup: 'B-',
        phone: '+880 1777-777777',
        location: { division: 'Rajshahi', district: 'Rajshahi', area: 'Shaheb Bazar' },
        lastDonationDate: '2024-05-30',
        age: 35,
        height: 172,
        weight: 70,
        physicalCondition: 'Good health, teacher, donated multiple times',
        distance: 310.5,
      },
      {
        id: '8',
        name: 'Sabrina Khan',
        bloodGroup: 'AB-',
        phone: '+880 1788-888888',
        location: { division: 'Dhaka', district: 'Dhaka', area: 'Mohammadpur' },
        lastDonationDate: '2024-08-10',
        age: 29,
        height: 168,
        weight: 60,
        physicalCondition: 'Healthy, doctor, understands donation importance',
        distance: 3.8,
      },
      {
        id: '9',
        name: 'Ibrahim Hossain',
        bloodGroup: 'O+',
        phone: '+880 1799-999999',
        location: { division: 'Dhaka', district: 'Dhaka', area: 'Bashundhara' },
        lastDonationDate: '2024-07-15',
        age: 31,
        height: 176,
        weight: 80,
        physicalCondition: 'Active lifestyle, engineer, regular donor',
        distance: 5.5,
      },
      {
        id: '10',
        name: 'Zara Ahmed',
        bloodGroup: 'A+',
        phone: '+880 1700-101010',
        location: { division: 'Sylhet', district: 'Sylhet', area: 'Zindabazar' },
        lastDonationDate: '2024-06-01',
        age: 24,
        height: 163,
        weight: 57,
        physicalCondition: 'Excellent health, student, first-time donor',
        distance: 198.0,
      },
    ];

    // Filter donors who haven't donated in the last 120 days
    const today = new Date();
    const eligibleDonors = mockDonors.filter(donor => {
      const lastDonation = new Date(donor.lastDonationDate);
      const daysSinceLastDonation = Math.floor((today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceLastDonation >= 120;
    });

    setDonors(eligibleDonors);
    setFilteredDonors(eligibleDonors);
  }, []);

  useEffect(() => {
    let filtered = donors;

    // Filter by blood group
    if (searchBloodGroup) {
      filtered = filtered.filter(d => d.bloodGroup === searchBloodGroup);
    }

    // Filter by division
    if (selectedDivision !== 'all') {
      filtered = filtered.filter(d => d.location.division === selectedDivision);
    }

    // Sort by distance (nearest first)
    filtered = filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    setFilteredDonors(filtered);
  }, [searchBloodGroup, selectedDivision, donors]);

  const getDaysSinceLastDonation = (lastDonationDate: string) => {
    const today = new Date();
    const lastDonation = new Date(lastDonationDate);
    const days = Math.floor((today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to access the Blood Bank and find donors</p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Blood Bank</h1>
        <p className="text-gray-600">Find blood donors in your area - Donors shown haven't donated in the last 120 days</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <Heart className="w-8 h-8 mb-2" />
          <p className="text-red-100 mb-1">Total Donors</p>
          <p>{donors.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <Droplet className="w-8 h-8 mb-2" />
          <p className="text-blue-100 mb-1">Blood Groups</p>
          <p>8 Types</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <MapPin className="w-8 h-8 mb-2" />
          <p className="text-green-100 mb-1">Your Location</p>
          <p>{user.location.area}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <User className="w-8 h-8 mb-2" />
          <p className="text-purple-100 mb-1">Your Blood</p>
          <p>{user.bloodGroup}</p>
        </div>
      </div>

      {/* Donor Status Banner */}
      {!user.isDonor && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-3">
            <Heart className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-gray-900 mb-2">Become a Blood Donor</h3>
              <p className="text-gray-600 mb-4">
                Save lives by becoming a blood donor! Enable donor status in your profile to help others in need.
              </p>
              <button
                onClick={() => onNavigate('profile')}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Enable Donor Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Search by Blood Group</label>
            <div className="relative">
              <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={searchBloodGroup}
                onChange={(e) => setSearchBloodGroup(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
              >
                <option value="">All Blood Groups</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Filter by Division</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
              >
                {divisions.map(d => (
                  <option key={d} value={d}>
                    {d === 'all' ? 'All Divisions' : d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchBloodGroup('');
                setSelectedDivision('all');
              }}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {searchBloodGroup && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700">
              Showing {filteredDonors.length} donor(s) with blood group <strong>{searchBloodGroup}</strong>
              {selectedDivision !== 'all' && ` in ${selectedDivision}`}
            </p>
          </div>
        )}
      </div>

      {/* Donors List */}
      <div className="space-y-4">
        {filteredDonors.length > 0 ? (
          filteredDonors.map((donor) => (
            <div key={donor.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 mb-4 lg:mb-0">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Droplet className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-gray-900">{donor.name}</h3>
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
                          {donor.bloodGroup}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{donor.distance} km away</span>
                        </span>
                      </div>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{donor.age} years old • {donor.height} cm • {donor.weight} kg</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{donor.location.area}, {donor.location.district}, {donor.location.division}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Last donated {getDaysSinceLastDonation(donor.lastDonationDate)} days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <p className="text-gray-700 mb-1">Physical Condition:</p>
                    <p className="text-gray-600">{donor.physicalCondition}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 lg:ml-6">
                  <a
                    href={`tel:${donor.phone}`}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Now</span>
                  </a>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Send Message
                  </button>
                  <div className="text-center text-gray-600">
                    {donor.phone}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No Donors Found</h3>
            <p className="text-gray-600 mb-4">
              {searchBloodGroup 
                ? `No donors with blood group ${searchBloodGroup} are currently available in the selected area.`
                : 'Try adjusting your search filters to find available donors.'}
            </p>
            <button
              onClick={() => {
                setSearchBloodGroup('');
                setSelectedDivision('all');
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-gray-900 mb-2">Important Information</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Donors shown have not donated blood in the last 120 days and are eligible to donate</li>
              <li>• Always verify donor eligibility before proceeding with donation</li>
              <li>• Contact donors respectfully and confirm their availability</li>
              <li>• Blood donation should be done at certified medical facilities</li>
              <li>• Donors must be between 18-60 years old and meet health requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
