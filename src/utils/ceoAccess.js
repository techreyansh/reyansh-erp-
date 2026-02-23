import authService from '../services/authService';

/**
 * Backend-level role validation for CEO-only resources.
 * Use in API calls or server middleware when CEO dashboard / master control APIs are implemented.
 * Frontend route protection is in CEOOnlyRoute; this utility is for consistent CEO checks.
 */
export const requireCEORole = () => {
  const isCEO = authService.hasRole('CEO');
  if (!isCEO) {
    throw new Error('Access Denied – Insufficient Privileges');
  }
  return true;
};

export const isCEORole = () => authService.hasRole('CEO');
