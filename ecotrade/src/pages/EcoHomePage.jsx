import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { industryAPI } from '../api/industryAPI';
import { materialAPI } from '../api/materialAPI';

export default function EcoHomePage() {
  const [industries, setIndustries] = useState([]);
  const [featuredMaterials, setFeaturedMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const industriesScrollRef = useRef(null);
  const featuredScrollRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [industriesRes, materialsRes] = await Promise.all([
        industryAPI.getAll(),
        materialAPI.getAll({ featured: true, limit: 6 })
      ]);

      if (industriesRes.success) {
        setIndustries(industriesRes.industries);
      }

      if (materialsRes.success) {
        setFeaturedMaterials(materialsRes.materials);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = ref.current.offsetWidth * 0.8;
      ref.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <section className="relative text-white py-12 md:py-16 lg:py-20 overflow-hidden min-h-[450px] md:min-h-[500px] lg:min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/image_febeff64.PNG"
            alt="Sustainable Recycling"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white font-semibold mb-2 md:mb-3 animate-fade-in drop-shadow-lg">
              One Place for All Your Business Needs
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 md:mb-4 leading-tight text-white drop-shadow-lg">
              Your Complete Business Solution Platform
            </h1>
            <p className="text-sm sm:text-base md:text-lg mb-4 md:mb-5 text-white max-w-2xl mx-auto leading-relaxed font-light drop-shadow-lg">
              Discover everything your business needs in one place: premium materials for production, industrial machines for operations, and business software for efficiency. Connect with verified suppliers, compare products, request quotes, and streamline your entire procurement process—all from our unified B2B marketplace platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center">
              <Link
                to="/eco-industries"
                className="bg-white text-green-600 px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-lg text-sm w-full sm:w-auto"
              >
                Explore Industries
              </Link>
              <Link
                to="/catalog?type=materials"
                className="bg-green-800 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-green-900 transition-all border-2 border-green-100 text-sm w-full sm:w-auto"
              >
                Browse Materials
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <p className="text-xs sm:text-sm uppercase tracking-wide text-green-600 font-semibold mb-2 sm:mb-3">
              Our Process
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-tight">
              How Eco Marketplace Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              From discovery to delivery, we simplify material, machine, and software sourcing with our streamlined 3-step process
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="relative">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 sm:p-8 h-full border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-600 text-white text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 mx-auto">
                  1
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center">
                  Discover Products
                </h3>
                <p className="text-sm sm:text-base text-gray-700 text-center mb-4 sm:mb-6 leading-relaxed">
                  Browse our comprehensive catalog of materials, industrial machines, and software solutions across multiple industries. Find exactly what you need with advanced search and filtering capabilities.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>500+ verified materials, machines & software</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Industry-specific categories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Detailed specifications & documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Real-time availability & pricing</span>
                  </li>
                </ul>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                  →
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 sm:p-8 h-full border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-600 text-white text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center">
                  Verify & Compare
                </h3>
                <p className="text-sm sm:text-base text-gray-700 text-center mb-4 sm:mb-6 leading-relaxed">
                  Review detailed product information, compare options, and verify quality certifications. Access comprehensive documentation, technical specifications, and supplier credentials for informed decision-making.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Quality certifications & compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Technical specifications & manuals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Supplier verification & ratings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Side-by-side product comparison</span>
                  </li>
                </ul>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  →
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 sm:p-8 h-full border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-orange-600 text-white text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 mx-auto">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center">
                Connect & Procure
              </h3>
              <p className="text-sm sm:text-base text-gray-700 text-center mb-4 sm:mb-6 leading-relaxed">
                Request quotes, schedule demos, arrange trials, and complete purchases with full support. Our platform facilitates direct communication with suppliers and handles the entire procurement process seamlessly.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">✓</span>
                  <span>Instant quote requests & responses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">✓</span>
                  <span>Product demos & trial arrangements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">✓</span>
                  <span>Secure payment & order tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">✓</span>
                  <span>Dedicated customer support</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Link
              to="/eco-materials"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-lg text-sm sm:text-base"
            >
              Start Sourcing Now
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <p className="text-xs sm:text-sm uppercase tracking-wide text-green-600 font-semibold mb-2 sm:mb-3">
              What We Offer
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Materials, Machines & Software - Everything You Need
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform provides comprehensive solutions across three key categories to meet all your business requirements
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Materials</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Source premium materials for your production needs. From raw materials to processed components, find quality-certified supplies with detailed specifications, availability tracking, and supplier verification.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Raw materials & components</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Quality certifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Real-time inventory</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Machines</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Find industrial machinery and equipment for your operations. Browse verified machines with detailed specifications, manufacturer information, pricing, and availability. Compare options and request demos.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Industrial equipment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Manufacturer details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Demo & trial options</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Software</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Discover business software solutions to enhance your operations. From management systems to specialized tools, find software with detailed features, system requirements, licensing options, and developer information.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Business management tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Multiple license types</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Feature comparisons</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-wide text-green-600 font-semibold mb-1 sm:mb-2">
                Industries We Serve
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight">
                Trusted by Leading Sectors
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                Connecting businesses with materials, machines, and software solutions across diverse industries—from manufacturing and construction to technology and services
              </p>
            </div>
            <Link
              to="/eco-industries"
              className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all text-sm sm:text-base"
            >
              View All Industries →
            </Link>
          </div>

          <div className="-mx-4 px-4 relative">
            <button
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center text-green-600 hover:bg-green-50 transition"
              onClick={() => scrollContainer(industriesScrollRef, 'prev')}
            >
              ‹
            </button>
            <button
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center text-green-600 hover:bg-green-50 transition"
              onClick={() => scrollContainer(industriesScrollRef, 'next')}
            >
              ›
            </button>
            <div
              ref={industriesScrollRef}
              className="overflow-x-auto hide-scrollbar pb-6 scroll-smooth"
            >
              <div className="flex gap-4 sm:gap-5 snap-x snap-mandatory min-w-max pr-4">
                {industries.map((industry) => (
                  <Link
                    key={industry._id}
                    to={`/catalog?type=materials&industry=${industry.slug}`}
                    className="snap-start flex-none w-[280px] sm:w-72 md:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-green-500"
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
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                            {industry.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {industry.materialCount} materials
                          </p>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
                        {industry.description}
                      </p>
                      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                        <span className="text-green-600">Explore Catalog</span>
                        <span className="text-green-600 text-base sm:text-lg">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredMaterials.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <p className="text-xs sm:text-sm uppercase tracking-wide text-green-600 font-semibold mb-2 sm:mb-3">
                Quality Certified
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 leading-tight">
                Featured Materials
              </h2>
            </div>
            <div className="-mx-4 px-4 relative">
              <button
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center text-green-600 hover:bg-green-50 transition"
                onClick={() => scrollContainer(featuredScrollRef, 'prev')}
              >
                ‹
              </button>
              <button
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center text-green-600 hover:bg-green-50 transition"
                onClick={() => scrollContainer(featuredScrollRef, 'next')}
              >
                ›
              </button>
              <div
                ref={featuredScrollRef}
                className="overflow-x-auto hide-scrollbar pb-6 scroll-smooth"
              >
                <div className="flex gap-4 sm:gap-6 min-w-max pr-4">
                  {featuredMaterials.map((material) => (
                    <Link
                      key={material._id}
                      to={`/eco-materials/${material._id}`}
                      className="flex-none w-[280px] sm:w-72 md:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 hover:border-green-500"
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
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                      <div className="p-5 sm:p-6">
                        <div className="text-xs sm:text-sm text-green-600 font-semibold mb-2">
                          {material.materialCode}
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 leading-tight line-clamp-2">
                          {material.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                          {material.description}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-4">
                          <span className="text-gray-600 text-xs sm:text-sm">
                            Available: {material.availableQuantity} {material.unit}
                          </span>
                          <span className="bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-green-700 transition-all w-full sm:w-auto text-center">
                            Request Quote
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <p className="text-xs sm:text-sm uppercase tracking-wide text-green-600 font-semibold mb-2 sm:mb-3">
              The Eco Marketplace Advantage
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 leading-tight">
              Why Industry Leaders Choose Us
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-green-600 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl font-semibold">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">Comprehensive Catalog</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Access a unified marketplace featuring materials, industrial machines, and business software. All products are verified, quality-certified, and sourced from trusted suppliers across multiple industries.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-green-600 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl font-semibold">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">Verified Suppliers</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Connect with a curated network of pre-vetted suppliers specializing in materials, machinery, and software solutions. Each supplier is verified for quality, reliability, and business credentials.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
              <div className="bg-green-600 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl font-semibold">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">Expert Support</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Our dedicated support team assists you throughout the entire process—from product discovery and comparison to quote requests, demos, and final procurement. Get help when you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 leading-tight">
            Ready to Streamline Your Business Procurement?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-green-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of businesses using our platform to source materials, machines, and software. Start exploring our catalog today and discover how we can simplify your procurement process.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              to="/eco-materials"
              className="inline-block bg-white text-green-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-lg text-sm sm:text-base w-full sm:w-auto"
            >
              Browse Materials
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-green-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-900 transition-all border-2 border-white text-sm sm:text-base w-full sm:w-auto"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
