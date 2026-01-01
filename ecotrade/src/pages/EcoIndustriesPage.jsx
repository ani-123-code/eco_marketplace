import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { industryAPI } from '../api/industryAPI';

export default function EcoIndustriesPage() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await industryAPI.getAll();
        if (res.success) {
          setIndustries(res.industries);
        }
      } catch (error) {
        console.error('Error loading industries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  const filteredIndustries = useMemo(() => {
    if (!searchTerm.trim()) return industries;
    const term = searchTerm.toLowerCase();
    return industries.filter(
      (industry) =>
        industry.name.toLowerCase().includes(term) ||
        industry.description?.toLowerCase().includes(term)
    );
  }, [industries, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm uppercase tracking-widest text-green-200 font-semibold mb-2 sm:mb-3">
              Eco Marketplace Industries
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
              Explore All Industries We Empower
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 leading-relaxed">
              Browse every sector actively sourcing post-consumer recycled materials through our network.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow p-5 sm:p-6 md:p-8 -mt-12 sm:-mt-16 mb-8 sm:mb-10 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Active Industries</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {industries.length}+ Industries
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Filter and explore to find the perfect match for your sourcing needs.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search industries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                />
                <Link
                  to="/eco-materials"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-green-600 text-white font-semibold text-center hover:bg-green-700 transition-all text-sm sm:text-base"
                >
                  Browse Materials
                </Link>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : filteredIndustries.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No industries found</h3>
              <p className="text-gray-600">
                Try adjusting your search to find the industry you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredIndustries.map((industry) => (
                <Link
                  key={industry._id}
                  to={`/eco-materials?industry=${industry.slug}`}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition-all border border-gray-100 hover:border-green-500 overflow-hidden"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center mb-3 sm:mb-4">
                      {industry.icon && (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-50 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                          <img
                            src={industry.icon}
                            alt={industry.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                            {industry.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {industry.materialCount} materials listed
                          </p>
                        </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
                      {industry.description}
                    </p>
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                      <span className="text-green-600">View compatible materials</span>
                      <span className="text-green-600 text-base sm:text-lg">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

