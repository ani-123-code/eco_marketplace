import React, { useState } from 'react';
import { Store, CheckCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import { sellerRequestAPI } from '../../api/sellerRequestAPI';

export default function BecomeSellerModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    company_name: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email && !formData.mobile) {
      setError('Please provide either email or mobile number');
      return;
    }

    if (!formData.name.trim() || !formData.company_name.trim()) {
      setError('Name and company name are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await sellerRequestAPI.create(formData);

      if (response.success) {
        setSubmitted(true);
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        throw new Error(response.message || 'Failed to submit request');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      company_name: ''
    });
    setSubmitted(false);
    setError('');
    onClose();
  };

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Request Submitted">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Thank You!
          </h3>
          <p className="text-gray-700 mb-4">
            Your seller registration request has been submitted successfully.
          </p>
          <p className="text-gray-600">
            Our team will review your application and contact you within 24-48 hours.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Become a Seller">
      <div className="space-y-6">
        <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4 border border-green-100">
          <Store className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Join Our Supplier Network</h3>
            <p className="text-sm text-gray-700">
              Partner with Eco Marketplace to reach industrial buyers seeking quality Post-Consumer Recycled materials.
              Fill out the form below and our team will contact you to discuss partnership opportunities.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="+91 88610 09443"
            />
            <p className="text-xs text-gray-500 mt-1">
              * Either email or mobile number is required
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company / Business Name *
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Your company name"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white font-semibold text-lg py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h4 className="font-bold text-gray-900 mb-2 text-sm">What happens next?</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Our team reviews your application within 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>We contact you to discuss your materials and capabilities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>After verification, you'll be onboarded to our supplier network</span>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
