import React, { useEffect, useState } from 'react';
import { contactAPI } from '../../api/contactAPI';
import { useToast } from '../../contexts/ToastContext';

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' }
];

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await contactAPI.getAll();
      if (res.success) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error('Error loading contact messages:', error);
      showToast('Failed to load contact messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await contactAPI.updateStatus(id, { status });
      showToast('Status updated', 'success');
      loadMessages();
    } catch (error) {
      console.error('Update status error:', error);
      showToast('Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
          <p className="text-gray-500">Track inbound inquiries from the website contact page.</p>
        </div>
        <button
          onClick={loadMessages}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No contact messages yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.map((msg) => (
                <tr key={msg._id}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{msg.name}</div>
                    <div className="text-sm text-gray-500">{msg.email}</div>
                    {msg.phone && <div className="text-sm text-gray-500">{msg.phone}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{msg.company || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-sm">
                    <p className="line-clamp-3">{msg.message}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={msg.status}
                      onChange={(e) => handleStatusChange(msg._id, e.target.value)}
                      disabled={updatingId === msg._id}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(msg.createdAt).toLocaleDateString()} <br />
                    <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

