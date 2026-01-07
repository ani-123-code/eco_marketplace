import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { materialAPI } from '../api/materialAPI';
import { machineAPI } from '../api/machineAPI';
import { softwareAPI } from '../api/softwareAPI';
import { industryAPI } from '../api/industryAPI';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  
  const productType = searchParams.get('type') || 'materials';
  const industrySlug = searchParams.get('industry');
  const page = searchParams.get('page') || 1;
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    loadIndustries();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [productType, industrySlug, page, searchQuery]);

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

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        industry: industrySlug,
        page,
        search: searchQuery
      };

      let res;
      if (productType === 'materials') {
        res = await materialAPI.getAll(params);
        if (res.success) {
          setProducts(res.materials);
          setPagination(res.pagination);
        }
      } else if (productType === 'machines') {
        res = await machineAPI.getAll(params);
        if (res.success) {
          setProducts(res.machines);
          setPagination(res.pagination);
        }
      } else if (productType === 'software') {
        res = await softwareAPI.getAll(params);
        if (res.success) {
          setProducts(res.software);
          setPagination(res.pagination);
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
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

  const handleTypeChange = (type) => {
    const params = new URLSearchParams(searchParams);
    params.set('type', type);
    params.delete('page');
    setSearchParams(params);
  };

  const getProductLink = (product) => {
    if (productType === 'materials') {
      return `/eco-materials/${product._id}`;
    } else if (productType === 'machines') {
      return `/machines/${product._id}`;
    } else if (productType === 'software') {
      return `/software/${product._id}`;
    }
    return '#';
  };

  const getProductCode = (product) => {
    if (productType === 'materials') return product.materialCode;
    if (productType === 'machines') return product.machineCode;
    if (productType === 'software') return product.softwareCode;
    return '';
  };

  const renderProductCard = (product) => {
    const code = getProductCode(product);
    const link = getProductLink(product);
    
    return (
      <Link
        key={product._id}
        to={link}
        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 hover:border-green-500"
      >
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-40 sm:h-48 object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              const placeholder = e.target.nextElementSibling;
              if (placeholder) {
                placeholder.classList.remove('hidden');
              }
            }}
          />
        ) : null}
        <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center hidden">
          <span className="text-gray-400 text-sm">No image</span>
        </div>
        <div className="p-4 sm:p-5">
          <div className="text-xs sm:text-sm text-green-600 font-semibold mb-2">
            {code}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            {productType === 'materials' && (
              <span className="text-xs sm:text-sm text-gray-600">
                Available: {product.availableQuantity} {product.unit}
              </span>
            )}
            {productType === 'machines' && (
              <span className="text-xs sm:text-sm text-gray-600">
                {product.manufacturer && `${product.manufacturer} `}
                {product.availability && `• ${product.availability.replace('-', ' ')}`}
              </span>
            )}
            {productType === 'software' && (
              <span className="text-xs sm:text-sm text-gray-600">
                {product.developer && `${product.developer} `}
                {product.licenseType && `• ${product.licenseType}`}
              </span>
            )}
            <span className="text-green-600 font-semibold text-xs sm:text-sm">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
            Your Catalog
          </h1>
          
          {/* Product Type Filter */}
          <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => handleTypeChange('materials')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                productType === 'materials'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Materials
            </button>
            <button
              onClick={() => handleTypeChange('machines')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                productType === 'machines'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Machines
            </button>
            <button
              onClick={() => handleTypeChange('software')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                productType === 'software'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Software
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4 sm:mb-6 flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${productType} by name, code, or description...`}
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

          {/* Industry Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete('industry');
                setSearchParams(params);
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
                  const params = new URLSearchParams(searchParams);
                  params.set('industry', industry.slug);
                  setSearchParams(params);
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

        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-lg">No {productType} found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map(renderProductCard)}
              </div>

              {pagination.pages > 1 && (
                <div className="mt-6 sm:mt-8 flex justify-center gap-2 flex-wrap">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', pageNum);
                        setSearchParams(params);
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
  );
}

