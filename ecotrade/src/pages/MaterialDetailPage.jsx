import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { materialAPI } from '../api/materialAPI';
import RequestQuoteModal from '../components/modals/RequestQuoteModal';

export default function MaterialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [relatedMaterials, setRelatedMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    loadMaterial();
  }, [id]);

  const loadMaterial = async () => {
    try {
      setLoading(true);
      const res = await materialAPI.getById(id);
      if (res.success) {
        setMaterial(res.material);
        setRelatedMaterials(res.relatedMaterials || []);
      }
    } catch (error) {
      console.error('Error loading material:', error);
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

  if (!material) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Material not found</h2>
          <button
            onClick={() => navigate('/eco-materials')}
            className="text-green-600 hover:text-green-700"
          >
            ← Back to Materials
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
            {material.images && material.images.length > 0 ? (
              <img
                src={material.images[0]}
                alt={material.name}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                loading="lazy"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error('❌ Image load error:', material.images[0]);
                  console.error('Material ID:', material._id);
                  console.error('Image URL:', material.images[0]);
                  e.target.style.display = 'none';
                  const placeholder = e.target.nextSibling;
                  if (placeholder) {
                    placeholder.classList.remove('hidden');
                  }
                }}
                onLoad={() => {
                  console.log('✅ Image loaded successfully:', material.images[0]);
                }}
              />
            ) : null}
            <div className={`w-full h-64 sm:h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center ${material.images && material.images.length > 0 ? 'hidden' : ''}`}>
              <span className="text-sm sm:text-base text-gray-400">No image available</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 lg:p-8">
            <div className="text-xs sm:text-sm text-green-600 font-semibold mb-2">
              {material.materialCode}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
              {material.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{material.description}</p>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Available Quantity:</span>
                <span className="text-xs sm:text-sm text-gray-800">
                  {material.availableQuantity} {material.unit}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Minimum Order:</span>
                <span className="text-xs sm:text-sm text-gray-800">
                  {material.minimumOrderQuantity} {material.unit}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Industry:</span>
                <span className="text-xs sm:text-sm text-gray-800">{material.industry?.name}</span>
              </div>
              {material.supplyRegion && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Supply Region:</span>
                  <span className="text-xs sm:text-sm text-gray-800">{material.supplyRegion}</span>
                </div>
              )}
            </div>

            {material.certifications && material.certifications.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Certifications:</h3>
                <div className="flex flex-wrap gap-2">
                  {material.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowRequestModal(true)}
              className="w-full bg-green-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-all text-sm sm:text-base"
            >
              Request Quote
            </button>
          </div>
        </div>

        {material && (
          <RequestQuoteModal
            isOpen={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            material={material}
          />
        )}

        {material.attributes && material.attributes.size > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {Array.from(material.attributes.entries()).map(([key, attr]) => (
                <div key={key} className="border-b pb-2 sm:pb-3">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">{attr.label}:</span>
                  <span className="ml-2 text-xs sm:text-sm text-gray-800">
                    {Array.isArray(attr.value) ? attr.value.join(', ') : attr.value}
                    {attr.unit && ` ${attr.unit}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {relatedMaterials.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Related Materials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedMaterials.map(mat => (
                <div
                  key={mat._id}
                  onClick={() => navigate(`/eco-materials/${mat._id}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-green-500"
                >
                  {mat.images && mat.images[0] && (
                    <img
                      src={mat.images[0]}
                      alt={mat.name}
                      className="w-full h-36 sm:h-40 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 leading-tight line-clamp-2">{mat.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Available: {mat.availableQuantity} {mat.unit}
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
