import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ProtectedAdminRoute from "./pages/admin/ProtectedAdminRoute";
import EcoHeader from "./components/layout/EcoHeader";
import EcoFooter from "./components/layout/EcoFooter";
import EcoHomePage from "./pages/EcoHomePage";
import EcoIndustriesPage from "./pages/EcoIndustriesPage";
import MaterialsPage from "./pages/MaterialsPage";
import CatalogPage from "./pages/CatalogPage";
import MaterialDetailPage from "./pages/MaterialDetailPage";
import MachineDetailPage from "./pages/MachineDetailPage";
import SoftwareDetailPage from "./pages/SoftwareDetailPage";
import RequestConfirmationPage from "./pages/RequestConfirmationPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEcoHome from "./pages/admin/AdminEcoHome";
import AdminEcoIndustries from "./pages/admin/AdminEcoIndustries";
import AdminEcoMaterials from "./pages/admin/AdminEcoMaterials";
import AdminEcoRequests from "./pages/admin/AdminEcoRequests";
import AdminContactMessages from "./pages/admin/AdminContactMessages";
import AdminSecretGuard from "./components/admin/AdminSecretGuard";
import ToastContainer from "./components/ui/ToastContainer";
import ScrollToTop from "./components/ScrollToTop";
import { 
  ADMIN_LOGIN_PATH, 
  ADMIN_DASHBOARD_PATH,
  ADMIN_ECO_HOME_PATH,
  ADMIN_ECO_INDUSTRIES_PATH,
  ADMIN_ECO_MATERIALS_PATH,
  ADMIN_ECO_REQUESTS_PATH,
  ADMIN_CONTACT_MESSAGES_PATH,
  isAdminRoute as checkIsAdminRoute
} from "./constants/adminRoutes";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = checkIsAdminRoute(location.pathname);

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="min-h-screen">{children}</main>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EcoHeader />
      <main className="flex-1">{children}</main>
      <EcoFooter />
      <ToastContainer />
    </div>
  );
};

function EcoApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<EcoHomePage />} />
              <Route path="/eco-home" element={<EcoHomePage />} />
              <Route path="/eco-industries" element={<EcoIndustriesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/eco-materials" element={<MaterialsPage />} />
              <Route path="/eco-materials/:id" element={<MaterialDetailPage />} />
              <Route path="/machines/:id" element={<MachineDetailPage />} />
              <Route path="/software/:id" element={<SoftwareDetailPage />} />
              <Route path="/request-confirmation/:requestId" element={<RequestConfirmationPage />} />

              {/* Admin Login Route - Protected with Secret (Encrypted Path) */}
              <Route 
                path={ADMIN_LOGIN_PATH} 
                element={
                  <AdminSecretGuard>
                    <AdminLoginPage />
                  </AdminSecretGuard>
                } 
              />

              {/* Admin Routes - Protected with Secret (Encrypted Paths) */}
              <Route
                path={ADMIN_DASHBOARD_PATH}
                element={
                  <AdminSecretGuard>
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  </AdminSecretGuard>
                }
              />
              <Route
                path={ADMIN_ECO_HOME_PATH}
                element={
                  <AdminSecretGuard>
                    <ProtectedAdminRoute>
                      <AdminEcoHome />
                    </ProtectedAdminRoute>
                  </AdminSecretGuard>
                }
              />
              <Route
                path={ADMIN_ECO_INDUSTRIES_PATH}
                element={
                  <AdminSecretGuard>
                    <ProtectedAdminRoute>
                      <AdminEcoIndustries />
                    </ProtectedAdminRoute>
                  </AdminSecretGuard>
                }
              />
              <Route
                path={ADMIN_ECO_MATERIALS_PATH}
                element={
                  <AdminSecretGuard>
                    <ProtectedAdminRoute>
                      <AdminEcoMaterials />
                    </ProtectedAdminRoute>
                  </AdminSecretGuard>
                }
              />
              <Route
                path={ADMIN_ECO_REQUESTS_PATH}
                element={
                  <AdminSecretGuard>
                    <ProtectedAdminRoute>
                      <AdminEcoRequests />
                    </ProtectedAdminRoute>
                  </AdminSecretGuard>
                }
              />
              <Route
                path={ADMIN_CONTACT_MESSAGES_PATH}
                element={
                  <AdminSecretGuard>
                    <ProtectedAdminRoute>
                      <AdminContactMessages />
                    </ProtectedAdminRoute>
                  </AdminSecretGuard>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default EcoApp;
