import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, Building2, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { sellerRequestAPI } from '../../api/sellerRequestAPI';

export default function AdminSellerRequests() {
  const [sellerRequests, setSellerRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchSellerRequests();
  }, []);

  useEffect(() => {
    filterAndSearchRequests();
  }, [sellerRequests, searchTerm, filterStatus]);

  const fetchSellerRequests = async () => {
    try {
      setLoading(true);
      const response = await sellerRequestAPI.getAll();
      if (response.success) {
        setSellerRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching seller requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearchRequests = () => {
    let filtered = sellerRequests;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(req => req.status === filterStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(req =>
        req.name.toLowerCase().includes(term) ||
        req.company_name.toLowerCase().includes(term) ||
        (req.email && req.email.toLowerCase().includes(term)) ||
        (req.mobile && req.mobile.includes(term))
      );
    }

    setFilteredRequests(filtered);
  };

  const updateRequestStatus = async (id, status, notes = '') => {
    try {
      const response = await sellerRequestAPI.update(id, { status, notes });
      if (response.success) {
        await fetchSellerRequests();
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Error updating seller request:', error);
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      const response = await sellerRequestAPI.delete(id);
      if (response.success) {
        await fetchSellerRequests();
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Error deleting seller request:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      contacted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Mail },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const stats = {
    total: sellerRequests.length,
    pending: sellerRequests.filter(r => r.status === 'pending').length,
    contacted: sellerRequests.filter(r => r.status === 'contacted').length,
    approved: sellerRequests.filter(r => r.status === 'approved').length,
    rejected: sellerRequests.filter(r => r.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Seller Requests</h2>
        <p className="text-gray-600 mt-1">Manage and review seller registration requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Requests</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
          <p className="text-sm text-yellow-800">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
          <p className="text-sm text-blue-800">Contacted</p>
          <p className="text-2xl font-bold text-blue-900">{stats.contacted}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
          <p className="text-sm text-green-800">Approved</p>
          <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4">
          <p className="text-sm text-red-800">Rejected</p>
          <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, company, email, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No seller requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{request.name}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {request.company_name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {request.email && (
                          <p className="text-sm text-gray-700 flex items-center gap-1">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {request.email}
                          </p>
                        )}
                        {request.mobile && (
                          <p className="text-sm text-gray-700 flex items-center gap-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {request.mobile}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailsModal(true);
                        }}
                        className="text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-900">Seller Request Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-semibold text-gray-900">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Company Name</p>
                  <p className="font-semibold text-gray-900">{selectedRequest.company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900">{selectedRequest.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Mobile</p>
                  <p className="text-gray-900">{selectedRequest.mobile || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Submitted On</p>
                  <p className="text-gray-900">{new Date(selectedRequest.created_at).toLocaleString()}</p>
                </div>
              </div>

              {selectedRequest.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Admin Notes</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.notes}</p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateRequestStatus(selectedRequest._id, 'pending')}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition font-medium"
                  >
                    Mark as Pending
                  </button>
                  <button
                    onClick={() => updateRequestStatus(selectedRequest._id, 'contacted')}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition font-medium"
                  >
                    Mark as Contacted
                  </button>
                  <button
                    onClick={() => updateRequestStatus(selectedRequest._id, 'approved')}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateRequestStatus(selectedRequest._id, 'rejected')}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={() => deleteRequest(selectedRequest._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
