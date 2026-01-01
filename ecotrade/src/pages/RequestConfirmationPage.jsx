import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buyerRequestAPI } from '../api/buyerRequestAPI';

const RequestConfirmationPage = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await buyerRequestAPI.getRequestById(requestId);
        if (response.data.success) {
          setRequest(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching request:', error);
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchRequest();
    }
  }, [requestId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Submitted Successfully!</h1>
          <p className="text-gray-600">
            Thank you for choosing Eco Marketplace. Our sourcing specialists have received your request and will contact you within 24 hours.
          </p>
        </div>

        {request && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Request Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Request ID:</span>
                <span className="font-semibold">{request.requestId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Company Name:</span>
                <span className="font-semibold">{request.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contact Person:</span>
                <span className="font-semibold">{request.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity Requested:</span>
                <span className="font-semibold">{request.requestedQuantity} {request.requestedUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {request.status}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <h3 className="font-semibold text-gray-900">What happens next?</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              Our sourcing specialists will review your requirements within 24 hours
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              We will contact you via email or phone to discuss your specifications
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              You will receive a comprehensive quote with quality documentation and delivery timeline
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/eco-materials"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse More Materials
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestConfirmationPage;
