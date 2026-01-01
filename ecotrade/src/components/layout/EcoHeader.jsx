import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Store } from 'lucide-react';
import BecomeSellerModal from '../modals/BecomeSellerModal';

export default function EcoHeader() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);

  const navLinks = [
    { to: '/eco-home', label: 'Home' },
    { to: '/eco-industries', label: 'Industries' },
    { to: '/eco-materials', label: 'Materials' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
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
