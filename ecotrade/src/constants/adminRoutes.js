// Encrypted admin routes for security
// Note: Using URL-safe characters to avoid React Router pattern conflicts
// Original: /asse3432/12ww3ed(** -> using -xx instead of (**
// Original: /1sd3#$ -> using -hash instead of #$
export const ADMIN_LOGIN_PATH = '/asse3432/12ww3ed-xx';
export const ADMIN_DASHBOARD_PATH = '/1sd3-hash';

// Admin sub-routes (relative to dashboard)
export const ADMIN_ECO_HOME_PATH = `${ADMIN_DASHBOARD_PATH}/eco-home`;
export const ADMIN_ECO_INDUSTRIES_PATH = `${ADMIN_DASHBOARD_PATH}/eco-industries`;
export const ADMIN_ECO_MATERIALS_PATH = `${ADMIN_DASHBOARD_PATH}/eco-materials`;
export const ADMIN_MACHINES_PATH = `${ADMIN_DASHBOARD_PATH}/machines`;
export const ADMIN_SOFTWARE_PATH = `${ADMIN_DASHBOARD_PATH}/software`;
export const ADMIN_ECO_REQUESTS_PATH = `${ADMIN_DASHBOARD_PATH}/eco-requests`;
export const ADMIN_CONTACT_MESSAGES_PATH = `${ADMIN_DASHBOARD_PATH}/contact-messages`;

// Helper function to check if path is an admin route
export const isAdminRoute = (pathname) => {
  return pathname.startsWith(ADMIN_DASHBOARD_PATH) || pathname === ADMIN_LOGIN_PATH;
};

