import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../../api/analyticsAPI';
import { Link } from 'react-router-dom';
import { ADMIN_ECO_INDUSTRIES_PATH, ADMIN_ECO_MATERIALS_PATH, ADMIN_ECO_REQUESTS_PATH } from '../../constants/adminRoutes';

export default function AdminEcoHome() {
  const [metrics, setMetrics] = useState(null);
  const [topMaterials, setTopMaterials] = useState([]);
  const [stockReport, setStockReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [metricsRes, topMaterialsRes, stockRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getTopMaterials({ limit: 5 }),
        analyticsAPI.getStockReport()
      ]);

      if (metricsRes.success) {
        setMetrics(metricsRes.metrics);
      }

      if (topMaterialsRes.success) {
        setTopMaterials(topMaterialsRes.data);
      }

      if (stockRes.success) {
        setStockReport(stockRes);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Eco Marketplace Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin panel for PCR materials management</p>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Total Requests</div>
            <div className="text-4xl font-bold">{metrics.totalRequests || 0}</div>
            <div className="text-sm opacity-75 mt-2">All time</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Pending</div>
            <div className="text-4xl font-bold">{metrics.pendingRequests || 0}</div>
            <div className="text-sm opacity-75 mt-2">New + Reviewed</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Confirmed</div>
            <div className="text-4xl font-bold">{(metrics.confirmedRequests || 0) + (metrics.dispatchedRequests || 0)}</div>
            <div className="text-sm opacity-75 mt-2">In progress</div>
          </div>

          <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Completed</div>
            <div className="text-4xl font-bold">{metrics.completedRequests || 0}</div>
            <div className="text-sm opacity-75 mt-2">{metrics.fulfillmentRate || 0}% fulfillment</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Requested Materials</h2>
          {topMaterials.length > 0 ? (
            <div className="space-y-3">
              {topMaterials.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.materialInfo?.name}</p>
                    <p className="text-sm text-gray-600">{item.materialInfo?.materialCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{item.requestCount} requests</p>
                    <p className="text-sm text-gray-600">{item.totalQuantityRequested} units</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Stock Alerts</h2>
          {stockReport && (
            <div className="space-y-4">
              {stockReport.outOfStock && stockReport.outOfStock.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">Out of Stock ({stockReport.outOfStock.length})</h3>
                  <div className="space-y-2">
                    {stockReport.outOfStock.slice(0, 3).map((material) => (
                      <div key={material._id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="text-sm text-gray-800">{material.name}</span>
                        <span className="text-xs text-red-600 font-semibold">0 {material.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stockReport.lowStock && stockReport.lowStock.length > 0 && (
                <div>
                  <h3 className="font-semibold text-yellow-600 mb-2">Low Stock ({stockReport.lowStock.length})</h3>
                  <div className="space-y-2">
                    {stockReport.lowStock.slice(0, 3).map((material) => (
                      <div key={material._id} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <span className="text-sm text-gray-800">{material.name}</span>
                        <span className="text-xs text-yellow-600 font-semibold">
                          {material.availableQuantity} {material.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!stockReport.lowStock?.length && !stockReport.outOfStock?.length) && (
                <p className="text-gray-500 text-center py-8">All materials are well stocked</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to={ADMIN_ECO_INDUSTRIES_PATH}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Manage Industries</h3>
          <p className="text-sm text-gray-600">Add and manage industry categories</p>
          <div className="mt-4 text-green-600 font-semibold">
            {metrics?.activeIndustries || 0} Active →
          </div>
        </Link>

        <Link
          to={ADMIN_ECO_MATERIALS_PATH}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Manage Materials</h3>
          <p className="text-sm text-gray-600">Add materials and manage inventory</p>
          <div className="mt-4 text-green-600 font-semibold">
            {metrics?.totalMaterials || 0} Materials →
          </div>
        </Link>

        <Link
          to={ADMIN_ECO_REQUESTS_PATH}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Buyer Requests</h3>
          <p className="text-sm text-gray-600">Manage and process buyer requests</p>
          <div className="mt-4 text-green-600 font-semibold">
            {metrics?.pendingRequests || 0} Pending →
          </div>
        </Link>
      </div>

      {metrics?.recentRequests && metrics.recentRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Requests</h2>
          <div className="space-y-3">
            {metrics.recentRequests.map((request) => (
              <div key={request._id} className="flex items-center justify-between p-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{request.companyName}</p>
                  <p className="text-sm text-gray-600">{request.material?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {request.requestedQuantity} {request.requestedUnit}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
