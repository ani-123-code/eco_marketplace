import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { machineAPI } from '../api/machineAPI';
import RequestMachineModal from '../components/modals/RequestMachineModal';

export default function MachineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState(null);
  const [relatedMachines, setRelatedMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    loadMachine();
  }, [id]);

  const loadMachine = async () => {
    try {
      setLoading(true);
      const res = await machineAPI.getById(id);
      if (res.success) {
        setMachine(res.machine);
        setRelatedMachines(res.relatedMachines || []);
      }
    } catch (error) {
      console.error('Error loading machine:', error);
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

  if (!machine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Machine not found</h2>
          <button
            onClick={() => navigate('/catalog?type=machines')}
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
            {machine.images && machine.images.length > 0 ? (
              <img
                src={machine.images[0]}
                alt={machine.name}
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
            <div className={`w-full h-64 sm:h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center ${machine.images && machine.images.length > 0 ? 'hidden' : ''}`}>
              <span className="text-sm sm:text-base text-gray-400">No image available</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 lg:p-8">
            <div className="text-xs sm:text-sm text-green-600 font-semibold mb-2">
              {machine.machineCode}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
              {machine.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{machine.description}</p>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Industry:</span>
                <span className="text-xs sm:text-sm text-gray-800">{machine.industry?.name}</span>
              </div>
              {machine.manufacturer && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Manufacturer:</span>
                  <span className="text-xs sm:text-sm text-gray-800">{machine.manufacturer}</span>
                </div>
              )}
              {machine.model && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Model:</span>
                  <span className="text-xs sm:text-sm text-gray-800">{machine.model}</span>
                </div>
              )}
              {machine.price > 0 && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Price:</span>
                  <span className="text-xs sm:text-sm text-gray-800">{machine.currency} {machine.price}</span>
                </div>
              )}
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Availability:</span>
                <span className="text-xs sm:text-sm text-gray-800 capitalize">{machine.availability?.replace('-', ' ')}</span>
              </div>
            </div>

            {machine.certifications && machine.certifications.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Certifications:</h3>
                <div className="flex flex-wrap gap-2">
                  {machine.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {machine.features && machine.features.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-600">
                  {machine.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setShowRequestModal(true)}
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm sm:text-base"
            >
              Request Information
            </button>
          </div>
        </div>

        {machine && (
          <RequestMachineModal
            isOpen={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            machine={machine}
          />
        )}

        {machine.specifications && machine.specifications.size > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {Array.from(machine.specifications.entries()).map(([key, value]) => (
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

        {relatedMachines.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Related Machines</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedMachines.map(mach => (
                <div
                  key={mach._id}
                  onClick={() => navigate(`/machines/${mach._id}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-green-500"
                >
                  {mach.images && mach.images[0] && (
                    <img
                      src={mach.images[0]}
                      alt={mach.name}
                      className="w-full h-36 sm:h-40 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 leading-tight line-clamp-2">{mach.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {mach.availability && `Availability: ${mach.availability.replace('-', ' ')}`}
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

