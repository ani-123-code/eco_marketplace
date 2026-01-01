import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, Linkedin } from 'lucide-react';
import HowItWorksModal from '../modals/HowItWorksModal';
import FAQModal from '../modals/FAQModal';
import QualityStandardsModal from '../modals/QualityStandardsModal';

export default function EcoFooter() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showQualityStandards, setShowQualityStandards] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <img src="/logo_dark.png" alt="Eco Marketplace" className="h-8 sm:h-10 w-auto" />
              <div>
                <h3 className="text-white font-bold text-base sm:text-lg">Eco Marketplace</h3>
                <p className="text-xs text-gray-400">Powered by EcoDispose</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Your trusted B2B platform connecting industries with verified Post-Consumer Recycled materials. Driving the circular economy forward.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/eco-home" className="hover:text-green-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/eco-industries" className="hover:text-green-400 transition">
                  Industries
                </Link>
              </li>
              <li>
                <Link to="/eco-materials" className="hover:text-green-400 transition">
                  Browse Materials
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-green-400 transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/contact" className="hover:text-green-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setShowHowItWorks(true)}
                  className="hover:text-green-400 transition text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowFAQ(true)}
                  className="hover:text-green-400 transition text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowQualityStandards(true)}
                  className="hover:text-green-400 transition text-left"
                >
                  Quality Standards
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact Info</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:sales@ecodispose.com" className="hover:text-green-400 transition break-all">
                  sales@ecodispose.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+918861009443" className="hover:text-green-400 transition">
                  +91 88610 09443
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 text-xs sm:text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Eco Marketplace. All rights reserved. Powered by <a href="https://www.eco-dispose.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">EcoDispose</a>
            </p>

            <div className="flex space-x-3 sm:space-x-4">
              <a href="https://www.youtube.com/@EcoDispose" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors" aria-label="YouTube">
                <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="https://www.instagram.com/clenrgy.eco.dispose/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="https://www.linkedin.com/company/clenrgy-eco-dispose-india-llp/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
    <FAQModal isOpen={showFAQ} onClose={() => setShowFAQ(false)} />
    <QualityStandardsModal isOpen={showQualityStandards} onClose={() => setShowQualityStandards(false)} />
  </>
  );
}
