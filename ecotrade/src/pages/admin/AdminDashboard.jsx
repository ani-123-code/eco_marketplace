import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, ChevronRight, ChevronLeft, BarChart3, Factory, PackageOpen, FileText, Mail, Store } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminEcoHome from './AdminEcoHome';
import AdminEcoIndustries from './AdminEcoIndustries';
import AdminEcoMaterials from './AdminEcoMaterials';
import AdminEcoRequests from './AdminEcoRequests';
import AdminContactMessages from './AdminContactMessages';
import AdminSellerRequests from './AdminSellerRequests';

const AdminTab = {
  DASHBOARD: 'dashboard',
  INDUSTRIES: 'industries',
  MATERIALS: 'materials',
  REQUESTS: 'requests',
  CONTACTS: 'contacts',
  SELLERS: 'sellers',
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(AdminTab.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout, isAdmin, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMainWebsite = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const menuItems = [
    { key: AdminTab.DASHBOARD, label: 'Dashboard', icon: BarChart3 },
    { key: AdminTab.INDUSTRIES, label: 'Industries', icon: Factory },
    { key: AdminTab.MATERIALS, label: 'Materials', icon: PackageOpen },
    { key: AdminTab.REQUESTS, label: 'Buyer Requests', icon: FileText },
    { key: AdminTab.SELLERS, label: 'Seller Requests', icon: Store },
    { key: AdminTab.CONTACTS, label: 'Contact Leads', icon: Mail },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case AdminTab.DASHBOARD:
        return <AdminEcoHome />;
      case AdminTab.INDUSTRIES:
        return <AdminEcoIndustries />;
      case AdminTab.MATERIALS:
        return <AdminEcoMaterials />;
      case AdminTab.REQUESTS:
        return <AdminEcoRequests />;
      case AdminTab.SELLERS:
        return <AdminSellerRequests />;
      case AdminTab.CONTACTS:
        return <AdminContactMessages />;
      default:
        return <AdminEcoHome />;
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeSidebar}
        />
      )}

      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 right-0 z-50 xl:hidden bg-green-600 text-white p-4 shadow-lg hover:bg-green-700 transition-all"
        >
          <Menu size={22} />
        </button>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-green-600 text-white transition-all duration-300 ${
          isMobile
            ? `${sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'}`
            : `${sidebarOpen ? 'w-52' : 'w-16'} translate-x-0`
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-6 border-b border-green-700">
            <div className="flex items-center">
              {!isMobile && (
                <span className="-ml-2 text font-bold">Eco Admin</span>
              )}
              {isMobile && (
                <>
                  <img
                    src="/logo1.png"
                    alt="Eco Marketplace Admin"
                    className="h-8 w-32 rounded flex-shrink-0"
                  />
                  <span className="ml-2 text-lg font-bold">Admin</span>
                </>
              )}
            </div>
            {isMobile && sidebarOpen && (
              <button
                onClick={closeSidebar}
                className="p-1 rounded-md hover:bg-green-700 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="px-2 py-4 border-b border-green-700">
            <button
              onClick={handleMainWebsite}
              className="flex items-center w-full px-3 py-3 rounded-md transition-colors text-gray-300 hover:bg-green-700 hover:text-white"
              title="Main Website"
            >
              <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {(sidebarOpen || isMobile) && (
                <span className="ml-3 text-sm font-medium">Main Website</span>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleTabChange(item.key)}
                    className={`flex items-center w-full px-3 py-3 rounded-md transition-colors ${
                      activeTab === item.key
                        ? 'bg-green-700 text-white'
                        : 'text-gray-300 hover:bg-green-700 hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {(sidebarOpen || isMobile) && (
                      <span className="ml-3 text-sm font-medium">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-green-700 p-4">
            <div className="flex items-center justify-center mb-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              {(sidebarOpen || isMobile) && (
                <div className="ml-3 min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{user?.name}</div>
                  <div className="text-xs text-gray-300 truncate">{user?.email}</div>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-green-700 hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {(sidebarOpen || isMobile) && (
                <span className="ml-2">Sign out</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 ${
        isMobile ? 'ml-0' : (sidebarOpen ? 'ml-52' : 'ml-16')
      }`}>
        <div className="p-3 lg:p-4 xl:p-6">
          <div className="rounded-lg bg-white shadow-sm">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 z-40 bg-green-600 text-white p-2 rounded-r-md transform -translate-y-1/2 transition-all duration-300"
          style={{ left: sidebarOpen ? '12rem' : '3rem' }}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      )}
    </div>
  );
};

export default AdminDashboard;
