import { useState, useEffect } from 'react';
import { User } from 'oidc-client-ts';
import { jwtDecode } from 'jwt-decode';

// Global user state
let globalUser: User | null = null;
let subscribers: Array<(user: User | null) => void> = [];

// Function to set user data (called from singleSpa.tsx)
export const setGlobalUser = (user: User | null) => {
  globalUser = user;
  subscribers.forEach((callback) => callback(user));
};

// Custom hook to access user data
export const useUser = () => {
  const [user, setUser] = useState<User | null>(globalUser);

  useEffect(() => {
    const unsubscribe = (newUser: User | null) => {
      setUser(newUser);
    };
    subscribers.push(unsubscribe);
    return () => {
      subscribers = subscribers.filter((callback) => callback !== unsubscribe);
    };
  }, []);

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
    const decoded: any = jwtDecode(token);
    const roles: string[] = decoded?.realm_access?.roles || [];

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
