import React from 'react';
import { Shield, Award, FileCheck, Microscope, Globe, Recycle } from 'lucide-react';
import Modal from '../ui/Modal';

const standards = [
  {
    icon: Shield,
    title: 'ISO Certifications',
    description: 'All suppliers maintain ISO 9001 (Quality Management) and ISO 14001 (Environmental Management) certifications.',
    details: [
      'Regular third-party audits',
      'Continuous improvement processes',
      'Documented quality procedures',
      'Environmental impact monitoring'
    ]
  },
  {
    icon: Award,
    title: 'Global Recycled Standards (GRS)',
    description: 'Materials meet GRS requirements for recycled content verification, chain of custody, social and environmental practices.',
    details: [
      'Minimum 20% recycled content verification',
      'Complete chain of custody tracking',
      'Chemical restrictions compliance',
      'Social and labor requirements'
    ]
  },
  {
    icon: FileCheck,
    title: 'Material Testing & Verification',
    description: 'Comprehensive testing protocols ensure materials meet specified quality parameters and performance standards.',
    details: [
      'Physical and mechanical property testing',
      'Chemical composition analysis',
      'Contaminant screening',
      'Performance benchmarking'
    ]
  },
  {
    icon: Microscope,
    title: 'Third-Party Laboratory Testing',
    description: 'Independent, accredited laboratories conduct testing to international standards with full documentation.',
    details: [
      'ISO 17025 accredited labs',
      'ASTM and EN standard testing',
      'Certificate of Analysis (CoA) provided',
      'Batch-specific test reports'
    ]
  },
  {
    icon: Globe,
    title: 'Regulatory Compliance',
    description: 'Materials comply with regional and international regulations including REACH, RoHS, FDA, and local standards.',
    details: [
      'REACH compliance for EU markets',
      'RoHS directive compliance',
      'FDA approval for food-contact materials',
      'Regional regulatory adherence'
    ]
  },
  {
    icon: Recycle,
    title: 'Sustainability Verification',
    description: 'Environmental impact assessment and sustainability credentials verified for all materials.',
    details: [
      'Carbon footprint calculation',
      'Recycled content verification',
      'Waste diversion documentation',
      'Circular economy contribution metrics'
    ]
  }
];

const qualityProcess = [
  {
    step: 'Supplier Qualification',
    description: 'Rigorous vetting process including facility audits, certification review, and quality system assessment.'
  },
  {
    step: 'Material Testing',
    description: 'Comprehensive testing of material samples against specified parameters by accredited laboratories.'
  },
  {
    step: 'Documentation Review',
    description: 'Verification of all compliance certificates, test reports, and quality documentation.'
  },
  {
    step: 'Ongoing Monitoring',
    description: 'Continuous quality monitoring with regular audits, batch testing, and performance tracking.'
  }
];

export default function QualityStandardsModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quality Standards & Certifications">
      <div className="space-y-8">
        <div>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            At Eco Marketplace, quality and compliance are non-negotiable. Every material undergoes rigorous
            testing and certification to ensure it meets the highest international standards.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our comprehensive quality assurance framework guarantees that you receive materials that perform
            to specification, comply with regulations, and support your sustainability goals.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Our Quality Standards</h3>
          <div className="grid gap-6">
            {standards.map((standard, index) => {
              const Icon = standard.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{standard.title}</h4>
                      <p className="text-gray-700 mb-4">{standard.description}</p>
                      <ul className="space-y-2">
                        {standard.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Our Quality Assurance Process</h3>
          <div className="space-y-4">
            {qualityProcess.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{item.step}</h4>
                  <p className="text-gray-700 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <h4 className="font-bold text-gray-900 mb-4">Quality Guarantee</h4>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Documentation Package:</strong> Every order includes complete test reports,
              certificates of analysis, compliance certificates, and material safety data sheets.
            </p>
            <p>
              <strong>Quality Assurance:</strong> If materials don't meet specifications, we provide
              immediate replacement or full refund at no additional cost.
            </p>
            <p>
              <strong>Traceability:</strong> Full batch traceability and chain of custody documentation
              for complete transparency and compliance.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h4 className="font-bold text-gray-900 mb-2">Need Specific Certifications?</h4>
          <p className="text-gray-700 mb-4">
            Looking for materials with specific certifications or test requirements? Contact our team
            to discuss your exact specifications and compliance needs.
          </p>
          <a
            href="mailto:sales@ecodispose.com"
            className="inline-flex items-center justify-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Contact Quality Team
          </a>
        </div>
      </div>
    </Modal>
  );
}
