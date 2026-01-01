import React from 'react';
import { Search, Shield, Truck, CheckCircle } from 'lucide-react';
import Modal from '../ui/Modal';

const steps = [
  {
    icon: Search,
    title: 'Browse & Select Materials',
    description: 'Explore our extensive catalog of Post-Consumer Recycled materials across multiple industries. Filter by material type, industry, certifications, and availability to find exactly what you need.',
    details: [
      'Access 500+ verified PCR materials',
      'Advanced search and filtering options',
      'Detailed specifications and certifications',
      'Real-time availability updates'
    ]
  },
  {
    icon: Shield,
    title: 'Validate Quality & Compliance',
    description: 'Every material undergoes rigorous quality testing and compliance verification. Review certifications, test reports, and supplier credentials to ensure materials meet your exact requirements.',
    details: [
      'ISO certified quality standards',
      'Third-party testing documentation',
      'Environmental compliance certificates',
      'Supplier audit reports'
    ]
  },
  {
    icon: Truck,
    title: 'Request Quote & Sample',
    description: 'Submit your requirements through our streamlined request form. Our sourcing specialists will coordinate samples, technical documentation, and provide competitive pricing within 24 hours.',
    details: [
      'No-obligation quote requests',
      'Free sample coordination',
      'Dedicated account manager',
      '24-hour response guarantee'
    ]
  },
  {
    icon: CheckCircle,
    title: 'Seamless Delivery & Support',
    description: 'Once approved, we coordinate end-to-end logistics with full visibility. Track your shipment, receive quality assurance documentation, and get ongoing support for repeat orders.',
    details: [
      'End-to-end logistics management',
      'Real-time shipment tracking',
      'Quality documentation package',
      'Ongoing procurement support'
    ]
  }
];

export default function HowItWorksModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How Eco Marketplace Works">
      <div className="space-y-8">
        <p className="text-lg text-gray-700 leading-relaxed">
          Our platform simplifies the entire PCR material sourcing process, from discovery to delivery.
          Here's how we help you accelerate your sustainability journey:
        </p>

        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-green-600">STEP {index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <h4 className="font-bold text-gray-900 mb-3">Why Choose Our Process?</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">98% Quality Compliance</p>
                <p className="text-sm text-gray-600">Industry-leading quality standards</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">24-Hour Response</p>
                <p className="text-sm text-gray-600">Fast turnaround on all requests</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">250+ Verified Suppliers</p>
                <p className="text-sm text-gray-600">Extensive vetted network</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Full Transparency</p>
                <p className="text-sm text-gray-600">Complete visibility throughout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
