import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Modal from '../ui/Modal';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What types of materials are available on Eco Marketplace?',
        a: 'We offer a comprehensive range of Post-Consumer Recycled (PCR) materials including recycled plastics (PET, HDPE, PP, LDPE), recycled metals (aluminum, steel, copper), recycled glass, recycled paper and cardboard, and specialty materials. All materials are quality-certified and compliance-tested.'
      },
      {
        q: 'Do I need to create an account to browse materials?',
        a: 'No account is required to browse our material catalog. You can explore all available materials, view specifications, and check certifications freely. An account is only needed if you want to save favorites or track your request history.'
      },
      {
        q: 'How do I request a quote or sample?',
        a: 'Simply click "Request Quote" on any material page, fill out the brief form with your requirements, and submit. Our sourcing specialists will respond within 24 hours with pricing, availability, and sample coordination options.'
      }
    ]
  },
  {
    category: 'Quality & Compliance',
    questions: [
      {
        q: 'How do you ensure material quality?',
        a: 'Every material on our platform undergoes rigorous quality testing and certification. We work only with verified suppliers who maintain ISO certifications, provide third-party lab test reports, and comply with international environmental standards. We provide full documentation with every order.'
      },
      {
        q: 'What certifications do your materials have?',
        a: 'Our materials carry various certifications depending on type and application, including ISO 9001, ISO 14001, GRS (Global Recycled Standard), RCS (Recycled Claim Standard), FDA compliance for food-grade materials, and REACH compliance for European markets.'
      },
      {
        q: 'Can I get material samples before ordering?',
        a: 'Yes! We coordinate free sample shipments for qualified buyers. Request samples through the material page or contact our team directly. Samples typically ship within 3-5 business days with all relevant technical documentation.'
      }
    ]
  },
  {
    category: 'Pricing & Orders',
    questions: [
      {
        q: 'What is the minimum order quantity?',
        a: 'Minimum order quantities vary by material and supplier. Most materials have MOQs ranging from 100 kg to 1,000 kg. Specific MOQs are listed on each material page. For custom requirements, contact our team for flexible options.'
      },
      {
        q: 'How is pricing determined?',
        a: 'Pricing is based on material type, quantity, quality grade, certifications, and delivery location. We provide transparent, competitive pricing from our verified supplier network. Volume discounts are available for large or recurring orders.'
      },
      {
        q: 'What payment terms do you offer?',
        a: 'We offer flexible payment terms including advance payment, letter of credit, and NET-30/60 terms for qualified buyers. Specific terms are negotiated based on order size and customer relationship. Our team will discuss options during the quote process.'
      }
    ]
  },
  {
    category: 'Delivery & Logistics',
    questions: [
      {
        q: 'How long does delivery take?',
        a: 'Delivery timelines vary based on material type, quantity, and destination. Domestic deliveries typically take 5-15 days, while international shipments take 15-30 days. We provide estimated delivery windows during the quote process and real-time tracking for all shipments.'
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we facilitate international shipping to most countries. We handle all export documentation, customs clearance, and logistics coordination. Our team ensures compliance with import/export regulations for both origin and destination countries.'
      },
      {
        q: 'What if materials arrive damaged or don\'t meet specifications?',
        a: 'All shipments include quality documentation and inspection reports. In the rare event of damage or specification mismatch, contact us within 48 hours of delivery. We will coordinate immediate resolution including replacement, refund, or corrective action at no additional cost.'
      }
    ]
  },
  {
    category: 'Sustainability & Impact',
    questions: [
      {
        q: 'How does using PCR materials benefit my company?',
        a: 'PCR materials help reduce environmental impact, meet sustainability targets, reduce carbon footprint, comply with circular economy regulations, improve brand reputation, and often reduce material costs. We provide impact reports showing CO2 savings and waste diverted from landfills.'
      },
      {
        q: 'Can you provide sustainability impact reports?',
        a: 'Yes! We provide comprehensive sustainability impact reports with every order, including CO2 emissions saved, virgin material replaced, waste diverted from landfills, and contribution to circular economy goals. Reports are suitable for ESG reporting and sustainability disclosures.'
      }
    ]
  }
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left hover:text-green-600 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 pr-12">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Frequently Asked Questions">
      <div className="space-y-8">
        <p className="text-lg text-gray-700">
          Find answers to common questions about Eco Marketplace, our materials, and the sourcing process.
        </p>

        {faqs.map((category, idx) => (
          <div key={idx}>
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-600">
              {category.category}
            </h3>
            <div className="space-y-2">
              {category.questions.map((item, i) => (
                <FAQItem key={i} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        ))}

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h4 className="font-bold text-gray-900 mb-2">Still have questions?</h4>
          <p className="text-gray-700 mb-4">
            Our team is here to help. Contact us directly for personalized assistance with your sourcing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:sales@ecodispose.com"
              className="inline-flex items-center justify-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Email Us
            </a>
            <a
              href="tel:+918861009443"
              className="inline-flex items-center justify-center px-6 py-2 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition"
            >
              Call +91 88610 09443
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
