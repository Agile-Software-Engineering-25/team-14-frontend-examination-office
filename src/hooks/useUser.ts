import { jwtDecode } from 'jwt-decode';
import { useAuthContext } from '@/context/AuthContext';

// Minimal typings for the parts of the JWT we access
type KeycloakRealmAccess = {
  roles?: string[];
};

type DecodedToken = {
  realm_access?: KeycloakRealmAccess;
  resource_access?: Record<string, KeycloakRealmAccess>;
  // Allow unknown extra fields without using `any`
  [key: string]: unknown;
};

export const useUser = () => {
  const { user } = useAuthContext();

  const getUserId = (): string => {
    return user?.profile.sub ?? '';
  };

  const getFirstName = (): string => {
    return user?.profile.given_name ?? '';
  };

  const getLastName = (): string => {
    return user?.profile.family_name ?? '';
  };

  const getFullName = (): string => {
    return user?.profile.name ?? '';
  };

  const getEmail = (): string => {
    return user?.profile.email ?? '';
  };

  const getAccessToken = (): string => {
    return user?.access_token ?? '';
  };

  // Function to check if user has a specific role
  const hasRole = (role: string): boolean => {
    const token = getAccessToken();
    if (!token) return false;

    // Decode JWT to extract roles
    const decoded = jwtDecode<DecodedToken>(token);
    const roles: string[] = decoded?.realm_access?.roles ?? [];

    if (!Array.isArray(roles) || roles.length === 0) return false;
    return roles.includes(role);
  };

  return {
    user,
    getUserId,
    getFirstName,
    getLastName,
    getFullName,
    getEmail,
    getAccessToken,
    hasRole,
  };
};

export default useUser;
