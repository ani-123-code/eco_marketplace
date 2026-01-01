import React, { useState } from 'react';
import { CheckCircle, Package } from 'lucide-react';
import Modal from '../ui/Modal';
import { buyerRequestAPI } from '../../api/buyerRequestAPI';
import { useToast } from '../../contexts/ToastContext';

export default function RequestQuoteModal({ isOpen, onClose, material }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerMobile: '',
    countryCode: '+91',
    companyName: '',
    requestedQuantity: '',
    specifications: ''
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

    if (!formData.buyerEmail && !formData.buyerMobile) {
      setError('Please provide either email or mobile number');
      return;
    }

    if (!formData.buyerName || !formData.companyName || !formData.requestedQuantity) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.requestedQuantity) < material.minimumOrderQuantity) {
      setError(`Minimum order quantity is ${material.minimumOrderQuantity} ${material.unit}`);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await buyerRequestAPI.create({
        ...formData,
        materialId: material._id,
        requestedQuantity: parseFloat(formData.requestedQuantity)
      });

      if (response.success) {
        setSubmitted(true);
        showToast('Quote request submitted successfully!', 'success');
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        throw new Error(response.message || 'Failed to submit request');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit request. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      buyerName: '',
      buyerEmail: '',
      buyerMobile: '',
      countryCode: '+91',
      companyName: '',
      requestedQuantity: '',
      specifications: ''
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
            Your quote request for <strong>{material.name}</strong> has been submitted successfully.
          </p>
          <p className="text-gray-600">
            Our team will review your request and contact you within 24 hours with a detailed quote.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Request Quote">
      <div className="space-y-6">
        <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4 border border-green-100">
          <Package className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Material Details</h3>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Material:</strong> {material.name}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Code:</strong> {material.materialCode}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Minimum Order:</strong> {material.minimumOrderQuantity} {material.unit}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="buyerName"
                value={formData.buyerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Your company name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="buyerEmail"
                value={formData.buyerEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <input
                  type="tel"
                  name="buyerMobile"
                  value={formData.buyerMobile}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="8861009443"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                * Either email or mobile number is required
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity Required ({material.unit}) *
            </label>
            <input
              type="number"
              name="requestedQuantity"
              value={formData.requestedQuantity}
              onChange={handleChange}
              required
              min={material.minimumOrderQuantity}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder={`Min: ${material.minimumOrderQuantity} ${material.unit}`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Specifications (Optional)
            </label>
            <textarea
              name="specifications"
              value={formData.specifications}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Any specific requirements, quality standards, delivery timelines, or questions..."
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
            {submitting ? 'Submitting...' : 'Submit Quote Request'}
          </button>
        </form>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h4 className="font-bold text-gray-900 mb-2 text-sm">What happens next?</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Our team reviews your request within 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>We'll send you a detailed quote with pricing and delivery terms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>You can coordinate samples and finalize the order</span>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

