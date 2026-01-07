import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Store, ChevronDown } from 'lucide-react';
import BecomeSellerModal from '../modals/BecomeSellerModal';

export default function EcoHeader() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCatalogDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/eco-home', label: 'Home' },
    { to: '/eco-industries', label: 'Industries' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  const catalogItems = [
    { to: '/catalog?type=materials', label: 'Materials' },
    { to: '/catalog?type=machines', label: 'Machines' },
    { to: '/catalog?type=software', label: 'Software' }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/eco-home" className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
            <img src="/logo_light.png" alt="Eco Marketplace" className="h-6 sm:h-7 md:h-8 lg:h-10 w-auto flex-shrink-0" />
            <div className="flex flex-col">
              <h1 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-gray-800 leading-tight">Eco Marketplace</h1>
              <p className="text-[10px] sm:text-xs text-gray-600 leading-tight">Powered by EcoDispose</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            <nav className="flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm xl:text-base text-gray-700 hover:text-green-600 font-medium transition"
                >
                  {link.label}
                </Link>
              ))}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setCatalogDropdownOpen(!catalogDropdownOpen)}
                  className="flex items-center gap-1 text-sm xl:text-base text-gray-700 hover:text-green-600 font-medium transition"
                >
                  Catalog
                  <ChevronDown className={`w-4 h-4 transition-transform ${catalogDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {catalogDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {catalogItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setCatalogDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
            <button
              onClick={() => setShowSellerModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-3 xl:px-4 py-1.5 xl:py-2 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm text-sm xl:text-base"
            >
              <Store className="w-4 h-4" />
              <span>Become a Seller</span>
            </button>
          </div>

          <button
            className="lg:hidden text-gray-700 hover:text-green-600 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 sm:space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 font-medium transition py-2 px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-2 py-2">
                <div className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Catalog</div>
                <div className="pl-4 space-y-2">
                  {catalogItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block text-sm sm:text-base text-gray-600 hover:text-green-600 font-medium transition py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSellerModal(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all justify-center mt-2 sm:mt-4 text-sm sm:text-base"
              >
                <Store className="w-4 h-4" />
                <span>Become a Seller</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      <BecomeSellerModal
        isOpen={showSellerModal}
        onClose={() => setShowSellerModal(false)}
      />
    </header>
  );
}
