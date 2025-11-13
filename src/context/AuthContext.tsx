/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { User } from 'oidc-client-ts';
import { AUTH_USER_CHANGED_EVENT } from '@/constants/events';

type GetUserFn = () => User | null;

type AuthContextValue = {
  user: User | null;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// eslint-disable-next-line func-style, @typescript-eslint/naming-convention
export function AuthProvider({
  children,
  getUser,
}: {
  children: React.ReactNode;
  getUser?: GetUserFn;
}) {
  // initialize from root getUser (single-spa)
  const [user, setUser] = useState<User | null>(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return getUser ? getUser() : null;
  });

  // Listen to global auth change events (dispatched by root)
  useEffect(() => {
    const handler = (evt: Event) => {
      if (evt instanceof CustomEvent) {
        setUser(evt.detail ?? null);
      } else {
        setUser(null);
      }
    };
    window.addEventListener(AUTH_USER_CHANGED_EVENT, handler);
    return () => window.removeEventListener(AUTH_USER_CHANGED_EVENT, handler);
  }, []);

  const value = useMemo(() => ({ user }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line func-style
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!ctx) throw new Error('useUser/AuthContext: Missing <AuthProvider>');
  return ctx;
}
