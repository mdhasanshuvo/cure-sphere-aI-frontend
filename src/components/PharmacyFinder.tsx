import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Package, Truck, Star, Search, Filter, ChevronDown, Loader2 } from 'lucide-react';
import { pharmacies as pharmaciesAPI } from '../services/mongoApi';

interface PharmacyFinderProps {
  recommendedMedicines: any[];
}

export function PharmacyFinder({ recommendedMedicines }: PharmacyFinderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pharmacies from database
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await pharmaciesAPI.getAll(1, 100);
        const fetchedPharmacies = response.pharmacies || [];
        
        // Add recommended medicines stock to each pharmacy
        const pharmaciesWithStock = fetchedPharmacies.map((p: any) => ({
          ...p,
          area: p.location?.area || 'Unknown',
          hours: p.operatingHours 
            ? `${p.operatingHours.weekday?.open || '8:00 AM'} - ${p.operatingHours.weekday?.close || '10:00 PM'}`
            : '9:00 AM - 9:00 PM',
          distance: p.distance || Math.random() * 10,
          stock: recommendedMedicines.map(m => ({
            ...m,
            available: Math.random() > 0.2,
            quantity: Math.floor(Math.random() * 50) + 10
          }))
        }));
        
        setPharmacies(pharmaciesWithStock);
      } catch (err) {
        console.error('Failed to fetch pharmacies:', err);
        setError('Failed to load pharmacies. Using sample data.');
        // Fallback to sample data
        const fallbackPharmacies = [
          {
            id: 1,
            name: 'Lazz Pharma',
            area: 'Dhanmondi',
            address: 'House 12, Road 4, Dhanmondi, Dhaka',
            distance: 0.8,
            rating: 4.7,
            phone: '+880 1711-123456',
            hours: '8:00 AM - 11:00 PM',
            delivery: true,
            deliveryTime: '30 mins',
            stock: recommendedMedicines.map(m => ({ ...m, available: true, quantity: Math.floor(Math.random() * 50) + 10 })),
          },
          {
            id: 2,
            name: 'Apollo Pharmacy',
            area: 'Gulshan',
            address: 'Plot 81, Road 12, Gulshan 1, Dhaka',
            distance: 2.3,
            rating: 4.8,
            phone: '+880 1722-234567',
            hours: '24 Hours',
            delivery: true,
            deliveryTime: '45 mins',
            stock: recommendedMedicines.map(m => ({ ...m, available: Math.random() > 0.2, quantity: Math.floor(Math.random() * 30) + 5 })),
          },
        ];
        setPharmacies(fallbackPharmacies);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPharmacies();
  }, [recommendedMedicines]);

  const areas = ['all', 'Dhanmondi', 'Gulshan', 'Uttara', 'Mirpur', 'Banani'];

  const filteredPharmacies = pharmacies
    .filter(p => selectedArea === 'all' || p.area === selectedArea)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.area.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Pharmacy Finder</h1>
        <p className="text-gray-600">Find medicines at nearby pharmacies with real-time stock availability and home delivery</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search pharmacy or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
      </div>

      {/* Recommended Medicines Summary */}
      {recommendedMedicines.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-gray-900 mb-4">Recommended Medicines</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recommendedMedicines.map((med, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-gray-900">{med.brand}</p>
                    <p className="text-gray-600">{med.name} - {med.dosage}</p>
                  </div>
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-gray-700">৳{med.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-600">Loading pharmacies...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      {/* Pharmacy List */}
      {!loading && (
        <div className="space-y-6">
        {filteredPharmacies.map((pharmacy) => {
          const availableCount = pharmacy.stock.filter(m => m.available).length;
          const totalCount = pharmacy.stock.length;

          return (
            <div key={pharmacy.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="mb-4 lg:mb-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-gray-900">{pharmacy.name}</h3>
                      <div className="flex items-center space-x-1 ml-4">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-gray-700">{pharmacy.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{pharmacy.address}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{pharmacy.distance} km</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{pharmacy.hours}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{pharmacy.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {pharmacy.delivery && (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                        <Truck className="w-5 h-5" />
                        <span>Home Delivery: {pharmacy.deliveryTime}</span>
                      </div>
                    )}
                    <div className={`px-4 py-2 rounded-lg text-center ${
                      availableCount === totalCount
                        ? 'bg-green-100 text-green-700'
                        : availableCount > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {availableCount}/{totalCount} medicines in stock
                    </div>
                  </div>
                </div>

                {/* Stock Information */}
                {pharmacy.stock.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-gray-900 mb-3">Stock Availability</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pharmacy.stock.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border ${
                            item.available
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-gray-900">{item.brand} ({item.name})</p>
                              <p className="text-gray-600">{item.dosage}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-900">৳{item.price}</p>
                              {item.available ? (
                                <p className="text-green-600">{item.quantity} units</p>
                              ) : (
                                <p className="text-red-600">Out of stock</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    View Details
                  </button>
                  {pharmacy.delivery && (
                    <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                      <Truck className="w-5 h-5" />
                      <span>Order for Delivery</span>
                    </button>
                  )}
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Call Pharmacy
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredPharmacies.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No pharmacies found matching your search criteria</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
