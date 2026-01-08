import React from 'react';

export default function AboutPage() {
  const highlights = [
    {
      title: 'Our Mission',
      description:
        'To be the one place where businesses can find everything they need—materials, machines, and software. We simplify procurement by connecting verified suppliers with businesses across industries, ensuring quality, transparency, and efficiency in every transaction.'
    },
    {
      title: 'Our Platform',
      description:
        'A comprehensive B2B marketplace featuring 500+ verified products across materials, industrial machines, and business software. Our platform serves diverse industries including manufacturing, construction, technology, and services, all in one unified ecosystem.'
    },
    {
      title: 'Our Impact',
      description:
        'Empowering businesses worldwide to streamline their procurement processes, reduce sourcing time, and access quality-certified products. We help companies optimize costs, improve efficiency, and accelerate growth through our integrated marketplace platform.'
    }
  ];

  const processSteps = [
    {
      title: 'Product Discovery',
      description: 'Browse our comprehensive catalog of materials, machines, and software. Use advanced search filters, compare specifications, and explore industry-specific categories to find exactly what your business needs.'
    },
    {
      title: 'Verification & Comparison',
      description:
        'Review detailed product information, certifications, and supplier credentials. Compare multiple options side-by-side, access technical documentation, and verify quality standards before making decisions.'
    },
    {
      title: 'Procurement & Support',
      description:
        'Request quotes, schedule demos or trials, and complete purchases seamlessly. Our platform facilitates direct communication with suppliers and provides dedicated support throughout the entire procurement journey.'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/Hero2.jpg"
            alt="Sustainable Materials"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <p className="uppercase text-xs sm:text-sm tracking-[0.35em] text-green-200 font-semibold mb-2 sm:mb-3">
              About One Place
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6 leading-tight">
              Your Complete Business Solution Platform
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 leading-relaxed">
              One Place (Eco Marketplace) is your comprehensive B2B marketplace connecting businesses with verified suppliers of premium materials, industrial machines, and business software. We simplify procurement, ensure quality, and accelerate business growth—all from one unified platform. Discover everything your business needs in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 items-center">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-widest text-green-600 font-semibold mb-3 sm:mb-4">
                Our Methodology
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Comprehensive Business Solutions from Discovery to Delivery
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                Eco Marketplace combines advanced search capabilities, comprehensive product catalogs, and verified supplier networks to streamline your entire procurement process. Whether you need materials for production, machines for operations, or software for business management, our platform provides end-to-end support—from product discovery and comparison to quote requests, demos, and final procurement. We ensure quality, verify credentials, and facilitate seamless transactions.
              </p>
              <div className="space-y-4 sm:space-y-5">
                {processSteps.map((step, index) => (
                  <div key={step.title} className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-700 font-semibold flex items-center justify-center mr-3 sm:mr-4 text-sm sm:text-base">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{step.title}</h4>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
              <p className="text-green-300 text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4">Platform Impact</p>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 leading-tight">500+ Products Across Materials, Machines & Software</h3>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-4 sm:mb-6">
                Businesses across industries trust One Place (Eco Marketplace) to streamline their procurement processes. Our integrated platform provides comprehensive visibility—from product discovery and supplier verification to quote management, order tracking, and quality assurance. We enable businesses to source materials, machines, and software all in one place, saving time and reducing complexity.
              </p>
              <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                  <p className="text-xl sm:text-2xl font-bold">98%</p>
                  <p className="text-xs sm:text-sm text-gray-200">Quality compliance rate</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                  <p className="text-xl sm:text-2xl font-bold">250+</p>
                  <p className="text-xs sm:text-sm text-gray-200">Verified suppliers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

