import { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Clock, Star, Tag, Home, Calendar, ChevronDown, Search, Loader2 } from 'lucide-react';
import { hospitals as hospitalsAPI } from '../services/mongoApi';

interface DiagnosticCentersProps {
  recommendedTests: any[];
}

export function DiagnosticCenters({ recommendedTests }: DiagnosticCentersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [diagnosticCenters, setDiagnosticCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure recommendedTests is always an array
  const safeRecommendedTests = recommendedTests || [];

  // Fetch diagnostic centers (hospitals) from database
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await hospitalsAPI.getAll(1, 100);
        const fetchedCenters = response.hospitals || [];
        
        // Transform hospital data to diagnostic center format
        const centersWithTests = fetchedCenters.map((h: any) => ({
          ...h,
          area: h.location?.area || 'Unknown',
          hours: h.operatingHours?.weekday 
            ? `${h.operatingHours.weekday.open} - ${h.operatingHours.weekday.close}`
            : '8:00 AM - 10:00 PM',
          distance: h.distance || Math.random() * 10,
          discount: Math.floor(Math.random() * 20) + 10,
          homeSample: true,
          homeSampleFee: 150 + Math.floor(Math.random() * 100),
          tests: safeRecommendedTests.map(t => ({
            ...t,
            available: true,
            discountedPrice: t.price * 0.85
          })),
          allTests: [
            { name: 'Complete Blood Count (CBC)', price: 800, discountedPrice: 680 },
            { name: 'Lipid Profile', price: 1200, discountedPrice: 1020 },
            { name: 'Liver Function Test', price: 1500, discountedPrice: 1275 },
            { name: 'Kidney Function Test', price: 1400, discountedPrice: 1190 },
            { name: 'Thyroid Profile', price: 1800, discountedPrice: 1530 },
            { name: 'Blood Sugar (Fasting)', price: 300, discountedPrice: 255 },
          ]
        }));
        
        setDiagnosticCenters(centersWithTests);
      } catch (err) {
        console.error('Failed to fetch diagnostic centers:', err);
        setError('Failed to load diagnostic centers. Using sample data.');
        // Fallback to sample data
        const fallbackCenters = [
          {
            id: 1,
            name: 'Popular Diagnostic Centre',
            area: 'Dhanmondi',
            address: 'House 16, Road 2, Dhanmondi, Dhaka 1205',
            distance: 1.2,
            rating: 4.8,
            phone: '+880 2-9675475',
            hours: '7:00 AM - 11:00 PM',
            discount: 15,
            homeSample: true,
            homeSampleFee: 200,
            tests: safeRecommendedTests.map(t => ({ ...t, available: true, discountedPrice: t.price * 0.85 })),
            allTests: [
              { name: 'Complete Blood Count (CBC)', price: 800, discountedPrice: 680 },
              { name: 'Lipid Profile', price: 1200, discountedPrice: 1020 },
              { name: 'Liver Function Test', price: 1500, discountedPrice: 1275 },
              { name: 'Kidney Function Test', price: 1400, discountedPrice: 1190 },
              { name: 'Thyroid Profile', price: 1800, discountedPrice: 1530 },
              { name: 'Blood Sugar (Fasting)', price: 300, discountedPrice: 255 },
            ],
          },
        ];
        setDiagnosticCenters(fallbackCenters);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCenters();
  }, [safeRecommendedTests]);

  const areas = ['all', 'Dhanmondi', 'Gulshan', 'Panthapath', 'Green Road'];

  const filteredCenters = diagnosticCenters
    .filter(c => selectedArea === 'all' || c.area === selectedArea)
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.area.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Diagnostic Centers</h1>
        <p className="text-gray-600">Find diagnostic centers with AI-suggested tests, discounts, and home sample collection</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search diagnostic center..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              {areas.map(area => (
                <option key={area} value={area}>
                  {area === 'all' ? 'All Areas' : area}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Recommended Tests Summary */}
      {safeRecommendedTests.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
          <h3 className="text-gray-900 mb-4">AI-Recommended Diagnostic Tests</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {safeRecommendedTests.map((test, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border border-purple-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-gray-900">{test.name}</p>
                    <p className="text-gray-600">{test.reason}</p>
                  </div>
                  <Building2 className="w-5 h-5 text-purple-500 flex-shrink-0 ml-2" />
                </div>
                <p className="text-gray-700">৳{test.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-600">Loading diagnostic centers...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      {/* Diagnostic Centers List */}
      {!loading && (
        <div className="space-y-6">
        {filteredCenters.map((center) => {
          const centerTests = center.tests || [];
          const recommendedAvailable = centerTests.filter(t => t.available).length;
          const totalRecommended = centerTests.length;

          return (
            <div key={center.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="mb-4 lg:mb-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-gray-900">{center.name}</h3>
                      <div className="flex items-center space-x-1 ml-4">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-gray-700">{center.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{center.address}</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{center.distance} km</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{center.hours}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{center.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                      <Tag className="w-5 h-5" />
                      <span>{center.discount}% Discount</span>
                    </div>
                    {center.homeSample && (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                        <Home className="w-5 h-5" />
                        <span>Home Collection: ৳{center.homeSampleFee}</span>
                      </div>
                    )}
                    {totalRecommended > 0 && (
                      <div className={`px-4 py-2 rounded-lg text-center ${
                        recommendedAvailable === totalRecommended
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {recommendedAvailable}/{totalRecommended} recommended tests available
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Tests */}
                {centerTests.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-gray-900 mb-3">AI-Recommended Tests at This Center</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {centerTests.map((test, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border ${
                            test.available
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-gray-900">{test.name}</p>
                              <p className="text-gray-600">{test.reason}</p>
                            </div>
                            <div className="text-right ml-3">
                              {test.available ? (
                                <>
                                  <p className="text-gray-400 line-through">৳{test.price}</p>
                                  <p className="text-green-700">৳{Math.round(test.discountedPrice)}</p>
                                </>
                              ) : (
                                <p className="text-red-600">Not available</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Available Tests */}
                {center.allTests && center.allTests.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-gray-900 mb-3">Other Popular Tests</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {center.allTests.map((test, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900 mb-1">{test.name}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-400 line-through">৳{test.price}</p>
                              <p className="text-gray-900">৳{test.discountedPrice}</p>
                            </div>
                            <Tag className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Book Appointment</span>
                  </button>
                  {center.homeSample && (
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                      <Home className="w-5 h-5" />
                      <span>Request Home Collection</span>
                    </button>
                  )}
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View All Tests
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredCenters.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No diagnostic centers found matching your search criteria</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
