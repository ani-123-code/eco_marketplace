import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { softwareAPI } from '../api/softwareAPI';
import RequestSoftwareModal from '../components/modals/RequestSoftwareModal';

export default function SoftwareDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [software, setSoftware] = useState(null);
  const [relatedSoftware, setRelatedSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    loadSoftware();
  }, [id]);

  const loadSoftware = async () => {
    try {
      setLoading(true);
      const res = await softwareAPI.getById(id);
      if (res.success) {
        setSoftware(res.software);
        setRelatedSoftware(res.relatedSoftware || []);
      }
    } catch (error) {
      console.error('Error loading software:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!software) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Software not found</h2>
          <button
            onClick={() => navigate('/catalog?type=software')}
            className="text-green-600 hover:text-green-700"
          >
            ← Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="text-green-600 hover:text-green-700 mb-4 sm:mb-6 flex items-center text-sm sm:text-base font-medium"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            {software.images && software.images.length > 0 ? (
              <img
                src={software.images[0]}
                alt={software.name}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const placeholder = e.target.nextSibling;
                  if (placeholder) {
                    placeholder.classList.remove('hidden');
                  }
                }}
              />
            ) : null}
            <div className={`w-full h-64 sm:h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center ${software.images && software.images.length > 0 ? 'hidden' : ''}`}>
              <span className="text-sm sm:text-base text-gray-400">No image available</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 lg:p-8">
            <div className="text-xs sm:text-sm text-green-600 font-semibold mb-2">
              {software.softwareCode}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
              {software.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{software.description}</p>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Industry:</span>
                <span className="text-xs sm:text-sm text-gray-800">{software.industry?.name}</span>
              </div>
              {software.developer && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Developer:</span>
                  <span className="text-xs sm:text-sm text-gray-800">{software.developer}</span>
                </div>
              )}
              {software.version && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Version:</span>
                  <span className="text-xs sm:text-sm text-gray-800">{software.version}</span>
                </div>
              )}
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">License Type:</span>
                <span className="text-xs sm:text-sm text-gray-800 capitalize">{software.licenseType?.replace('-', ' ')}</span>
              </div>
              {software.price > 0 && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Price:</span>
                  <span className="text-xs sm:text-sm text-gray-800">{software.currency} {software.price}</span>
                </div>
              )}
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Availability:</span>
                <span className="text-xs sm:text-sm text-gray-800 capitalize">{software.availability?.replace('-', ' ')}</span>
              </div>
            </div>

            {software.features && software.features.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-600">
                  {software.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setShowRequestModal(true)}
              className="w-full bg-purple-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all text-sm sm:text-base"
            >
              Request Information
            </button>
          </div>
        </div>

        {software && (
          <RequestSoftwareModal
            isOpen={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            software={software}
          />
        )}

        {software.specifications && software.specifications.size > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {Array.from(software.specifications.entries()).map(([key, value]) => (
                <div key={key} className="border-b pb-2 sm:pb-3">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">{key}:</span>
                  <span className="ml-2 text-xs sm:text-sm text-gray-800">
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {software.systemRequirements && software.systemRequirements.size > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">System Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {Array.from(software.systemRequirements.entries()).map(([key, value]) => (
                <div key={key} className="border-b pb-2 sm:pb-3">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">{key}:</span>
                  <span className="ml-2 text-xs sm:text-sm text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {relatedSoftware.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Related Software</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedSoftware.map(soft => (
                <div
                  key={soft._id}
                  onClick={() => navigate(`/software/${soft._id}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-green-500"
                >
                  {soft.images && soft.images[0] && (
                    <img
                      src={soft.images[0]}
                      alt={soft.name}
                      className="w-full h-36 sm:h-40 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 leading-tight line-clamp-2">{soft.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {soft.availability && `Availability: ${soft.availability.replace('-', ' ')}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

