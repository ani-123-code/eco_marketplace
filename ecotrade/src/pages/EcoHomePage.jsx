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

  const keyFeatures = [
    {
      title: 'Curated Listings',
      description: 'Hand-selected products, machinery, and software from trusted suppliers, complete with detailed descriptions and certifications',
      icon: '📋'
    },
    {
      title: 'Search and Filter Tools',
      description: 'Advanced search capabilities to easily find items by category, material type, origin, or specifications',
      icon: '🔍'
    },
    {
      title: 'Supply Chain Transparency',
      description: 'Full visibility into product origins, recycling processes, and compliance with environmental standards',
      icon: '🔗'
    },
    {
      title: 'Bulk Purchasing Options',
      description: 'Flexible options for large-volume orders, ideal for scaling operations',
      icon: '📦'
    },
    {
      title: 'Educational Resources',
      description: 'Guides, articles, and webinars on recycling best practices and industry trends',
      icon: '📚'
    },
    {
      title: 'Integration APIs',
      description: 'Seamless connectivity with your existing systems for inventory management and order tracking',
      icon: '🔌'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Seller Onboarding',
      description: 'Register on the platform, submit product details, certifications, and pricing information for review'
    },
    {
      step: 2,
      title: 'Buyer Search',
      description: 'Explore listings through intuitive browsing or targeted searches for specific PCR items, machinery, or software'
    },
    {
      step: 3,
      title: 'Transaction',
      description: 'Complete secure payments, arrange shipping logistics, and finalize agreements with digital contracts'
    },
    {
      step: 4,
      title: 'Verification',
      description: 'Every listing is thoroughly checked for authenticity and quality to maintain trust and standards'
    }
  ];

  const benefits = [
    {
      title: 'Cost Efficiency',
      description: 'Access affordable PCR alternatives that support budget-conscious sustainable sourcing',
      icon: '💰'
    },
    {
      title: 'Sustainability Boost',
      description: 'Enhance your environmental, social, and governance (ESG) initiatives by incorporating recycled content into your operations',
      icon: '🌱'
    },
    {
      title: 'Scalability',
      description: 'From small enterprises to large corporations, find tailored solutions to meet varying business needs',
      icon: '📈'
    },
    {
      title: 'Global Reach',
      description: 'Connect with a worldwide network of suppliers and buyers, minimizing supply chain risks and fostering international collaboration',
      icon: '🌍'
    }
  ];

  const industriesList = [
    'Packaging Industry',
    'Automotive and Construction',
    'Consumer Goods and Textiles',
    'Beauty and Personal Care',
    'Electronics and Manufacturing'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative text-white py-16 md:py-24 lg:py-32 overflow-hidden min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/Capturehero.PNG"
            alt="Sustainable Recycling"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white font-semibold mb-4 md:mb-6 animate-fade-in drop-shadow-lg">
              Eco Market Place
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 lg:mb-8 leading-tight font-sans text-white drop-shadow-lg">
              Your Dedicated Marketplace for Post-Consumer Recycled Solutions
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 lg:mb-10 text-white max-w-3xl mx-auto leading-relaxed font-light drop-shadow-lg">
              A specialized online platform connecting buyers and sellers in the recycling sector, offering post-consumer recycled (PCR) products, machinery, and software to promote sustainable sourcing and eco-friendly practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                to="/catalog"
                className="bg-white text-green-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-lg text-sm sm:text-base w-full sm:w-auto"
              >
                Explore Catalog
              </Link>
              <Link
                to="/eco-industries"
                className="bg-green-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-900 transition-all border-2 border-green-100 text-sm sm:text-base w-full sm:w-auto"
              >
                Browse Industries
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <p className="text-xs sm:text-sm uppercase tracking-wide text-green-600 font-semibold mb-2 sm:mb-3">
                About Eco Market Place
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Connecting the Recycling Industry
              </h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
                Eco Market Place is a focused marketplace designed for the recycling industry, where businesses can discover and procure post-consumer recycled materials, advanced machinery, and specialized software. We emphasize sustainability by facilitating access to verified eco-friendly alternatives, helping organizations reduce their environmental footprint while supporting circular economy principles.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                Our platform bridges suppliers and buyers globally, ensuring reliable transactions and transparent supply chains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <p className="text-xs sm:text-sm uppercase tracking-wide text-green-600 font-semibold mb-2 sm:mb-3">
              Platform Features
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Key Features
            </h2>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="text-4xl sm:text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <p className="text-xs sm:text-sm uppercase tracking-wide text-green-600 font-semibold mb-2 sm:mb-3">
              Our Process
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              How It Works
            </h2>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 sm:p-8 h-full border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-600 text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 text-center leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                      →
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <p className="text-xs sm:text-sm uppercase tracking-wide text-green-600 font-semibold mb-2 sm:mb-3">
              Why Choose Us
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Benefits
            </h2>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl sm:text-5xl flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <p className="text-xs sm:text-sm uppercase tracking-wide text-green-600 font-semibold mb-2 sm:mb-3">
              Our Reach
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Industries We Serve
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connecting businesses across diverse sectors with sustainable PCR solutions
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {industriesList.map((industry, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 sm:p-6 border-2 border-green-200 hover:border-green-400 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      {industry}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-8 sm:mt-10">
            <Link
              to="/eco-industries"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all shadow-lg text-sm sm:text-base"
            >
              View All Industries →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Materials Section */}
      {featuredMaterials.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <p className="text-xs sm:text-sm uppercase tracking-wide text-green-600 font-semibold mb-2 sm:mb-3">
                Quality Certified
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                Featured PCR Materials
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
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 leading-tight line-clamp-2">
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
                            View Details
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

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
            Ready to Start Your Sustainable Sourcing Journey?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-green-100 max-w-2xl mx-auto leading-relaxed">
            Join Eco Market Place today and connect with verified suppliers of post-consumer recycled materials, machinery, and software. Transform your supply chain with sustainable solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              to="/catalog"
              className="inline-block bg-white text-green-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-lg text-sm sm:text-base w-full sm:w-auto"
            >
              Explore Catalog
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
