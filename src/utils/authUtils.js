// Legacy auth helper shims kept only to avoid build-time import errors.
// New code should always use useAuth() from AuthContext instead.

export const getCurrentUser = () => null;

export const isAuthenticated = () => false;

export const getUserRole = () => null;

export const hasRole = () => false;

export const hasPermission = () => false;
