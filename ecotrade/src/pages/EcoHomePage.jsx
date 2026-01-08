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
      description: 'Hand-selected products, machinery, and software from trusted suppliers, complete with detailed descriptions and certifications'
    },
    {
      title: 'Search and Filter Tools',
      description: 'Advanced search capabilities to easily find items by category, material type, origin, or specifications'
    },
    {
      title: 'Supply Chain Transparency',
      description: 'Full visibility into product origins, recycling processes, and compliance with environmental standards'
    },
    {
      title: 'Bulk Purchasing Options',
      description: 'Flexible options for large-volume orders, ideal for scaling operations'
    },
    {
      title: 'Educational Resources',
      description: 'Guides, articles, and webinars on recycling best practices and industry trends'
    },
    {
      title: 'Integration APIs',
      description: 'Seamless connectivity with your existing systems for inventory management and order tracking'
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
      description: 'Access affordable PCR alternatives that support budget-conscious sustainable sourcing'
    },
    {
      title: 'Sustainability Boost',
      description: 'Enhance your environmental, social, and governance (ESG) initiatives by incorporating recycled content into your operations'
    },
    {
      title: 'Scalability',
      description: 'From small enterprises to large corporations, find tailored solutions to meet varying business needs'
    },
    {
      title: 'Global Reach',
      description: 'Connect with a worldwide network of suppliers and buyers, minimizing supply chain risks and fostering international collaboration'
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
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-28 lg:py-36 overflow-hidden min-h-[550px] md:min-h-[650px] lg:min-h-[750px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/Capturehero.PNG"
            alt="Sustainable Recycling"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm sm:text-base uppercase tracking-[0.3em] text-white/90 font-medium mb-6 md:mb-8 drop-shadow-lg">
              Eco Market Place
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold mb-6 md:mb-8 lg:mb-10 leading-[1.1] text-white drop-shadow-lg">
              Your Dedicated Marketplace for Post-Consumer Recycled Solutions
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-10 lg:mb-12 text-white/95 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-md">
              A specialized online platform connecting buyers and sellers in the recycling sector, offering post-consumer recycled (PCR) products, machinery, and software to promote sustainable sourcing and eco-friendly practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center">
              <Link
                to="/catalog"
                className="bg-white text-gray-900 px-8 sm:px-10 py-3.5 sm:py-4 rounded-md font-medium hover:bg-gray-100 transition-all shadow-lg text-base sm:text-lg w-full sm:w-auto"
              >
                Explore Catalog
              </Link>
              <Link
                to="/eco-industries"
                className="bg-transparent border-2 border-white text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-md font-medium hover:bg-white/10 transition-all text-base sm:text-lg w-full sm:w-auto"
              >
                Browse Industries
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Materials Section - Moved Up */}
      {featuredMaterials.length > 0 && (
        <section className="py-16 sm:py-20 md:py-24 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12 md:mb-14">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-3 leading-tight">
                Featured PCR Materials
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Quality-certified post-consumer recycled materials from verified suppliers
              </p>
            </div>
            <div className="-mx-4 px-4 relative">
              <button
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-12 h-12 items-center justify-center text-gray-700 hover:bg-gray-50 transition border border-gray-200"
                onClick={() => scrollContainer(featuredScrollRef, 'prev')}
              >
                ‹
              </button>
              <button
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-12 h-12 items-center justify-center text-gray-700 hover:bg-gray-50 transition border border-gray-200"
                onClick={() => scrollContainer(featuredScrollRef, 'next')}
              >
                ›
              </button>
              <div
                ref={featuredScrollRef}
                className="overflow-x-auto hide-scrollbar pb-6 scroll-smooth"
              >
                <div className="flex gap-5 sm:gap-6 min-w-max pr-4">
                  {featuredMaterials.map((material) => (
                    <Link
                      key={material._id}
                      to={`/eco-materials/${material._id}`}
                      className="flex-none w-[300px] sm:w-80 md:w-96 bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-200 hover:border-green-500 group"
                    >
                      {material.images && material.images[0] ? (
                        <div className="w-full h-48 sm:h-56 bg-gray-100 overflow-hidden">
                          <img
                            src={material.images[0]}
                            alt={material.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling?.classList.remove('hidden');
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 sm:h-56 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No image</span>
                        </div>
                      )}
                      <div className="p-5 sm:p-6">
                        <div className="text-xs sm:text-sm text-green-600 font-medium mb-2 uppercase tracking-wide">
                          {material.materialCode}
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-green-600 transition-colors">
                          {material.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                          {material.description}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-sm text-gray-500">
                            Available: {material.availableQuantity} {material.unit}
                          </span>
                          <span className="text-sm font-medium text-green-600 group-hover:text-green-700">
                            View Details →
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

      {/* About Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
                About Eco Market Place
              </h2>
            </div>
            <div className="space-y-5">
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
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
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-4 leading-tight">
              Key Features
            </h2>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
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
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-4 leading-tight">
              How It Works
            </h2>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-lg p-6 sm:p-8 h-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white text-lg sm:text-xl font-semibold mb-5 sm:mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
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
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-4 leading-tight">
              Benefits
            </h2>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-4 leading-tight">
              Industries We Serve
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              Connecting businesses across diverse sectors with sustainable PCR solutions
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {industriesList.map((industry, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-5 sm:p-6 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 flex-shrink-0"></div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                      {industry}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-10 sm:mt-12">
            <Link
              to="/eco-industries"
              className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-md bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all shadow-sm text-base sm:text-lg"
            >
              View All Industries →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 sm:mb-8 leading-tight">
            Ready to Start Your Sustainable Sourcing Journey?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join Eco Market Place today and connect with verified suppliers of post-consumer recycled materials, machinery, and software. Transform your supply chain with sustainable solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center">
            <Link
              to="/catalog"
              className="inline-block bg-white text-gray-900 px-8 sm:px-10 py-3.5 sm:py-4 rounded-md font-medium hover:bg-gray-100 transition-all shadow-lg text-base sm:text-lg w-full sm:w-auto"
            >
              Explore Catalog
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-transparent border-2 border-white text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-md font-medium hover:bg-white/10 transition-all text-base sm:text-lg w-full sm:w-auto"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
