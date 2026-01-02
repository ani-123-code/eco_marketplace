import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { materialAPI } from '../api/materialAPI';
import { industryAPI } from '../api/industryAPI';

export default function MaterialsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [materials, setMaterials] = useState([]);
  const [filters, setFilters] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');

  const industrySlug = searchParams.get('industry');
  const page = searchParams.get('page') || 1;
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    loadIndustries();
  }, []);

  useEffect(() => {
    loadMaterials();
    if (industrySlug) {
      loadFilters();
    }
  }, [industrySlug, page, selectedFilters, searchQuery]);

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const loadIndustries = async () => {
    try {
      const res = await industryAPI.getAll();
      if (res.success) {
        setIndustries(res.industries);
      }
    } catch (error) {
      console.error('Error loading industries:', error);
    }
  };

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const params = {
        industry: industrySlug,
        page,
        filters: JSON.stringify(selectedFilters),
        search: searchQuery
      };

      const res = await materialAPI.getAll(params);
      if (res.success) {
        setMaterials(res.materials);
        setPagination(res.pagination);
      }
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }
    params.delete('page');
    setSearchParams(params);
  };

  const loadFilters = async () => {
    try {
      const res = await materialAPI.getFilters(industrySlug);
      if (res.success) {
        setFilters(res.filters);
      }
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
  };

  const renderFilter = (filter) => {
    switch (filter.type) {
      case 'select':
      case 'multiselect':
        return (
          <div key={filter.key} className="mb-4 sm:mb-6">
            <h4 className="font-semibold text-sm sm:text-base text-gray-700 mb-2 sm:mb-3">{filter.label}</h4>
            <div className="space-y-2">
              {filter.options.map(option => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters[filter.key]?.includes(option)}
                    onChange={(e) => {
                      const current = selectedFilters[filter.key] || [];
                      const updated = e.target.checked
                        ? [...current, option]
                        : current.filter(v => v !== option);
                      handleFilterChange(filter.key, updated);
                    }}
                    className="mr-2 w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-600">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div key={filter.key} className="mb-4 sm:mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters[filter.key] || false}
                onChange={(e) => handleFilterChange(filter.key, e.target.checked)}
                className="mr-2 w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span className="text-xs sm:text-sm text-gray-700">{filter.label}</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
            PCR Materials Catalog
          </h1>
          <form onSubmit={handleSearch} className="mb-4 sm:mb-6 flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search materials by name or code..."
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
            />
            <div className="flex gap-2 sm:gap-3">
              <button
                type="submit"
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all text-sm sm:text-base"
              >
                Search
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    const params = new URLSearchParams(searchParams);
                    params.delete('search');
                    params.delete('page');
                    setSearchParams(params);
                  }}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                searchParams.delete('industry');
                setSearchParams(searchParams);
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all ${
                !industrySlug
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Industries
            </button>
            {industries.map(industry => (
              <button
                key={industry._id}
                onClick={() => {
                  searchParams.set('industry', industry.slug);
                  setSearchParams(searchParams);
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all ${
                  industrySlug === industry.slug
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {industry.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {filters.length > 0 && (
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">Filters</h3>
                  <button
                    onClick={handleClearFilters}
                    className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-semibold"
                  >
                    Clear All
                  </button>
                </div>
                {filters.map(renderFilter)}
              </div>
            </div>
          )}

          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600 text-lg">No materials found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {materials.map(material => (
                    <Link
                      key={material._id}
                      to={`/eco-materials/${material._id}`}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 hover:border-green-500"
                    >
                      {material.images && material.images[0] ? (
                        <img
                          src={material.images[0]}
                          alt={material.name}
                          className="w-full h-40 sm:h-48 object-cover"
                          onError={(e) => {
                            console.error('Image load error:', material.images[0]);
                            e.target.style.display = 'none';
                            e.target.nextSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center hidden">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                      <div className="p-4 sm:p-5">
                        <div className="text-xs sm:text-sm text-green-600 font-semibold mb-2">
                          {material.materialCode}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 leading-tight line-clamp-2">
                          {material.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {material.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-gray-600">
                            Available: {material.availableQuantity} {material.unit}
                          </span>
                          <span className="text-green-600 font-semibold text-xs sm:text-sm">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="mt-6 sm:mt-8 flex justify-center gap-2 flex-wrap">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => {
                          searchParams.set('page', pageNum);
                          setSearchParams(searchParams);
                        }}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base transition-all ${
                          pagination.page === pageNum
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
