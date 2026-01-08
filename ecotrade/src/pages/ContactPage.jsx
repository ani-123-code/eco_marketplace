import React, { useState } from 'react';
import { contactAPI } from '../api/contactAPI';
import { useToast } from '../contexts/ToastContext';

export default function ContactPage() {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in your name, email, and message.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await contactAPI.create(formData);
      showToast('Message sent successfully. Our team will reach out shortly.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send message';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/Hero3.jpg"
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-green-200 font-semibold mb-2 sm:mb-3">
              Get In Touch
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              Connect With Our Business Solutions Team
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 leading-relaxed">
              Whether you need materials for production, machines for operations, or software for business management, our team is here to help. Share your requirements and objectives, and we'll connect you with verified suppliers, provide technical documentation, and facilitate the entire procurement process.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Contact Information
              </h2>
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-2">Business Inquiries</p>
                  <a href="mailto:sales@ecodispose.com" className="text-base sm:text-lg text-green-600 font-semibold hover:underline break-all">
                    sales@ecodispose.com
                  </a>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-2">Direct Line</p>
                  <a href="tel:+918861009443" className="text-base sm:text-lg text-green-600 font-semibold hover:underline">
                    +91 88610 09443
                  </a>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-2">Business Hours</p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Monday – Friday<br />
                    9:30 AM – 6:30 PM IST
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Responses within 24 hours during business days
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Request a Consultation
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                      placeholder="+91 88610 09443"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                      placeholder="Your Company Name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Your Requirements & Objectives *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                    placeholder="Please describe your requirements (materials, machines, or software), target volumes, quality specifications, delivery timelines, budget, and any specific objectives..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white font-semibold text-base sm:text-lg py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition-all disabled:bg-gray-400"
                >
                  {submitting ? 'Submitting Request...' : 'Submit Consultation Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

