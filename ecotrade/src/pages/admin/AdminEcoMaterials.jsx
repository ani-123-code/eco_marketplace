import React, { useEffect, useState } from 'react';
import { materialAPI } from '../../api/materialAPI';
import { industryAPI } from '../../api/industryAPI';
import { uploadAPI } from '../../api/uploadAPI';
import { validateImageFile } from '../../utils/imageUpload';

export default function AdminEcoMaterials() {
  const [materials, setMaterials] = useState([]);
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
    availableQuantity: 0,
    unit: 'kg',
    minimumOrderQuantity: 1,
    images: [],
    certifications: [],
    supplyRegion: '',
    packagingType: '',
    isFeatured: false
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [selectedIndustry]);

  const loadData = async () => {
    try {
      const [industriesRes] = await Promise.all([
        industryAPI.getAll()
      ]);

      if (industriesRes.success) {
        setIndustries(industriesRes.industries);
      }

      await loadMaterials();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMaterials = async () => {
    try {
      const params = selectedIndustry ? { industry: selectedIndustry } : {};
      const res = await materialAPI.getAll(params);
      if (res.success) {
        setMaterials(res.materials);
      }
    } catch (error) {
      console.error('Error loading materials:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        certifications: formData.certifications.filter(c => c.trim()),
        images: formData.images.filter(i => i.trim())
      };

      if (editingId) {
        await materialAPI.update(editingId, data);
      } else {
        await materialAPI.create(data);
      }

      setShowModal(false);
      setEditingId(null);
      resetForm();
      loadMaterials();
    } catch (error) {
      console.error('Error saving material:', error);
      alert('Failed to save material');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      industry: '',
      description: '',
      availableQuantity: 0,
      unit: 'kg',
      minimumOrderQuantity: 1,
      images: [],
      certifications: [],
      supplyRegion: '',
      packagingType: '',
      isFeatured: false
    });
  };

  const handleEdit = (material) => {
    setEditingId(material._id);
    setFormData({
      name: material.name,
      industry: material.industry._id || material.industry,
      description: material.description || '',
      availableQuantity: material.availableQuantity,
      unit: material.unit,
      minimumOrderQuantity: material.minimumOrderQuantity,
      images: material.images || [],
      certifications: material.certifications || [],
      supplyRegion: material.supplyRegion || '',
      packagingType: material.packagingType || '',
      isFeatured: material.isFeatured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this material?')) {
      try {
        await materialAPI.delete(id);
        loadMaterials();
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  const handleStockAdjust = async (id) => {
    const quantity = prompt('Enter quantity to add (negative to subtract):');
    if (quantity !== null) {
      try {
        const operation = parseFloat(quantity) >= 0 ? 'add' : 'subtract';
        await materialAPI.adjustStock(id, operation, Math.abs(parseFloat(quantity)));
        loadMaterials();
      } catch (error) {
        console.error('Error adjusting stock:', error);
      }
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const newImages = [...formData.images];

    try {
      // Validate all files first
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

      // Upload all files to S3
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
      e.target.value = ''; // Reset input
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Materials</h1>
          <p className="text-gray-600 mt-1">Manage PCR materials catalog and inventory</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          + Add Material
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MOQ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materials.map((material) => (
                  <tr key={material._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {material.images?.[0] && (
                          <img src={material.images[0]} alt="" className="w-10 h-10 mr-3 object-cover rounded" />
                        )}
                        <span className="font-medium text-gray-900">{material.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{material.materialCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{material.industry?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        material.availableQuantity === 0 ? 'text-red-600' :
                        material.availableQuantity < 50 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {material.availableQuantity} {material.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {material.minimumOrderQuantity} {material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        material.isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {material.isFeatured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(material)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleStockAdjust(material._id)}
                        className="text-green-600 hover:text-green-800 mr-2"
                      >
                        Stock
                      </button>
                      <button
                        onClick={() => handleDelete(material._id)}
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
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Material' : 'Add Material'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.availableQuantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ 
                        ...formData, 
                        availableQuantity: value === '' ? '' : (parseFloat(value) || 0)
                      });
                    }}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="kg">kg</option>
                    <option value="tonne">tonne</option>
                    <option value="litre">litre</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Qty *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.minimumOrderQuantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ 
                        ...formData, 
                        minimumOrderQuantity: value === '' ? '' : (parseInt(value) || 1)
                      });
                    }}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supply Region</label>
                  <input
                    type="text"
                    value={formData.supplyRegion}
                    onChange={(e) => setFormData({ ...formData, supplyRegion: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
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
