import React, { useEffect, useState } from 'react';
import { buyerRequestAPI } from '../../api/buyerRequestAPI';
import { analyticsAPI } from '../../api/analyticsAPI';

export default function AdminEcoRequests() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestsRes, statsRes] = await Promise.all([
        buyerRequestAPI.getAll({ status: statusFilter || undefined, limit: 50 }),
        analyticsAPI.getDashboard()
      ]);

      if (requestsRes.success) {
        setRequests(requestsRes.requests);
      }

      if (statsRes.success) {
        setStats(statsRes.metrics);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const note = prompt(`Update to ${newStatus}. Add a note (optional):`);
    if (note !== null) {
      try {
        await buyerRequestAPI.updateStatus(id, newStatus, note);
        loadData();
        if (selectedRequest && selectedRequest._id === id) {
          const res = await buyerRequestAPI.getById(id);
          if (res.success) {
            setSelectedRequest(res.request);
          }
        }
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status. Check if stock is sufficient.');
      }
    }
  };

  const handleViewDetails = async (request) => {
    try {
      const res = await buyerRequestAPI.getById(request._id);
      if (res.success) {
        setSelectedRequest(res.request);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('Error loading request details:', error);
    }
  };

  const exportCSV = async () => {
    try {
      const blob = await buyerRequestAPI.export({ status: statusFilter || undefined });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `buyer-requests-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      New: 'bg-blue-100 text-blue-800',
      Reviewed: 'bg-yellow-100 text-yellow-800',
      Confirmed: 'bg-green-100 text-green-800',
      Dispatched: 'bg-purple-100 text-purple-800',
      Completed: 'bg-gray-100 text-gray-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Buyer Requests</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Requests</div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalRequests}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Confirmed</div>
            <div className="text-3xl font-bold text-green-600">{stats.confirmedRequests}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-3xl font-bold text-gray-600">{stats.completedRequests}</div>
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.requestId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.buyerName}</div>
                      <div className="text-sm text-gray-500">{request.buyerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {request.companyName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{request.material?.name}</div>
                      <div className="text-sm text-gray-500">{request.material?.materialCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {request.requestedQuantity} {request.requestedUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        View
                      </button>
                      {request.status === 'New' && (
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'Reviewed')}
                          className="text-green-600 hover:text-green-800"
                        >
                          Review
                        </button>
                      )}
                      {request.status === 'Reviewed' && (
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'Confirmed')}
                          className="text-green-600 hover:text-green-800"
                        >
                          Confirm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Request Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Request Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Request ID:</span>
                    <p className="font-medium">{selectedRequest.requestId}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <p className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Date:</span>
                    <p className="font-medium">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Buyer Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <p className="font-medium">{selectedRequest.buyerName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium">{selectedRequest.buyerEmail}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Mobile:</span>
                    <p className="font-medium">{selectedRequest.countryCode} {selectedRequest.buyerMobile}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Company:</span>
                    <p className="font-medium">{selectedRequest.companyName}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Material Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-lg">{selectedRequest.material?.name}</p>
                <p className="text-sm text-gray-600 mb-2">{selectedRequest.material?.materialCode}</p>
                <p className="text-sm text-gray-600">Industry: {selectedRequest.industry?.name}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Requested: <span className="font-semibold">{selectedRequest.requestedQuantity} {selectedRequest.requestedUnit}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Available: <span className="font-semibold">{selectedRequest.material?.availableQuantity} {selectedRequest.material?.unit}</span>
                </p>
              </div>
            </div>

            {selectedRequest.specifications && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Specifications</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedRequest.specifications}</p>
              </div>
            )}

            {selectedRequest.adminNotes && selectedRequest.adminNotes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Admin Notes</h3>
                <div className="space-y-2">
                  {selectedRequest.adminNotes.map((note, idx) => (
                    <div key={idx} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                      <p className="text-sm text-gray-700">{note.note}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(note.addedAt).toLocaleString()} by {note.addedBy?.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {selectedRequest.status === 'New' && (
                <button
                  onClick={() => handleStatusUpdate(selectedRequest._id, 'Reviewed')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Mark as Reviewed
                </button>
              )}
              {selectedRequest.status === 'Reviewed' && (
                <button
                  onClick={() => handleStatusUpdate(selectedRequest._id, 'Confirmed')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirm Request
                </button>
              )}
              {selectedRequest.status === 'Confirmed' && (
                <button
                  onClick={() => handleStatusUpdate(selectedRequest._id, 'Dispatched')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Mark as Dispatched
                </button>
              )}
              {selectedRequest.status === 'Dispatched' && (
                <button
                  onClick={() => handleStatusUpdate(selectedRequest._id, 'Completed')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Mark as Completed
                </button>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
