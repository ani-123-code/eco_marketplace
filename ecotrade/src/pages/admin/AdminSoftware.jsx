import React, { useEffect, useState } from 'react';
import { softwareAPI } from '../../api/softwareAPI';
import { industryAPI } from '../../api/industryAPI';
import { uploadAPI } from '../../api/uploadAPI';
import { validateImageFile } from '../../utils/imageUpload';

export default function AdminSoftware() {
  const [software, setSoftware] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    developer: '',
    version: '',
    licenseType: 'paid',
    price: 0,
    currency: 'USD',
    availability: 'available',
    images: [],
    features: [],
    tags: [],
    isFeatured: false
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadSoftware();
  }, [selectedIndustry]);

  const loadData = async () => {
    try {
      const [industriesRes] = await Promise.all([
        industryAPI.getAll()
      ]);

      if (industriesRes.success) {
        setIndustries(industriesRes.industries);
      }

      await loadSoftware();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSoftware = async () => {
    try {
      const params = selectedIndustry ? { industry: selectedIndustry } : {};
      const res = await softwareAPI.getAll(params);
      if (res.success) {
        setSoftware(res.software);
      }
    } catch (error) {
      console.error('Error loading software:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        features: formData.features.filter(f => f.trim()),
        tags: formData.tags.filter(t => t.trim()),
        images: formData.images.filter(i => i.trim())
      };

      if (editingId) {
        await softwareAPI.update(editingId, data);
      } else {
        await softwareAPI.create(data);
      }

      setShowModal(false);
      setEditingId(null);
      resetForm();
      loadSoftware();
    } catch (error) {
      console.error('Error saving software:', error);
      alert('Failed to save software');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      industry: '',
      description: '',
      developer: '',
      version: '',
      licenseType: 'paid',
      price: 0,
      currency: 'USD',
      availability: 'available',
      images: [],
      features: [],
      tags: [],
      isFeatured: false
    });
  };

  const handleEdit = (softwareItem) => {
    setEditingId(softwareItem._id);
    setFormData({
      name: softwareItem.name,
      industry: softwareItem.industry._id || softwareItem.industry,
      description: softwareItem.description || '',
      developer: softwareItem.developer || '',
      version: softwareItem.version || '',
      licenseType: softwareItem.licenseType || 'paid',
      price: softwareItem.price || 0,
      currency: softwareItem.currency || 'USD',
      availability: softwareItem.availability || 'available',
      images: softwareItem.images || [],
      features: softwareItem.features || [],
      tags: softwareItem.tags || [],
      isFeatured: softwareItem.isFeatured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this software?')) {
      try {
        await softwareAPI.delete(id);
        loadSoftware();
      } catch (error) {
        console.error('Error deleting software:', error);
      }
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const newImages = [...formData.images];

    try {
      const validFiles = [];
      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          alert(validation.error);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        setUploading(false);
        e.target.value = '';
        return;
      }

      const response = await uploadAPI.uploadImages(validFiles);
      
      if (response.success && response.imageUrls) {
        newImages.push(...response.imageUrls);
        setFormData({ ...formData, images: newImages });
      } else {
        alert('Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(`Failed to upload images: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setFormData({ ...formData, images: [...formData.images, url.trim()] });
    }
  };

  const addArrayItem = (field) => {
    const item = prompt(`Enter ${field}:`);
    if (item && item.trim()) {
      setFormData({ ...formData, [field]: [...formData[field], item.trim()] });
    }
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Software</h1>
          <p className="text-gray-600 mt-1">Manage software catalog for industries</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          + Add Software
        </button>
      </div>

      <div className="mb-4">
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Industries</option>
          {industries.map(ind => (
            <option key={ind._id} value={ind.slug}>{ind.name}</option>
          ))}
        </select>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Software</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Developer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {software.map((softwareItem) => (
                  <tr key={softwareItem._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {softwareItem.images?.[0] && (
                          <img src={softwareItem.images[0]} alt="" className="w-10 h-10 mr-3 object-cover rounded" />
                        )}
                        <span className="font-medium text-gray-900">{softwareItem.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{softwareItem.softwareCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{softwareItem.industry?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{softwareItem.developer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{softwareItem.licenseType}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {softwareItem.price > 0 ? `${softwareItem.currency} ${softwareItem.price}` : 'Free'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        softwareItem.isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {softwareItem.isFeatured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(softwareItem)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(softwareItem._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Software' : 'Add Software'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                  <select
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select Industry</option>
                    {industries.map(ind => (
                      <option key={ind._id} value={ind._id}>{ind.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Developer</label>
                  <input
                    type="text"
                    value={formData.developer}
                    onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Type</label>
                  <select
                    value={formData.licenseType}
                    onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                    <option value="subscription">Subscription</option>
                    <option value="open-source">Open Source</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="available">Available</option>
                    <option value="coming-soon">Coming Soon</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.features.map((feature, idx) => (
                      <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('features', idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('features')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, idx) => (
                      <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('tags', idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('tags')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    + Add Tag
                  </button>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer flex items-center">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                        {uploading ? 'Uploading...' : 'Upload Images'}
                      </label>
                      <button
                        type="button"
                        onClick={addImageUrl}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Add URL
                      </button>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={img}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-20 object-cover rounded border border-gray-300"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as Featured</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

