import { useAuth } from '../context/AuthContext';

export const useRequireCEORole = () => {
  const { user, role } = useAuth();

  if (!user) {
    throw new Error('Access Denied – Not authenticated');
  }

  if (role !== 'CEO') {
    throw new Error('Access Denied – Insufficient Privileges');
  }

  return true;
};

export const useIsCEORole = () => {
  const { role } = useAuth();
  return role === 'CEO';
};
