import { useQueryClient } from '@tanstack/react-query';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import type { PostLoginParams } from '../api/fetchLogin';
import { client } from '../api/hc';
import { COOKIE_AUTH_NAME } from '../config/cookies.constant';
import { useLogin, useLogout } from '../hooks/useAuth';
import { type User, useProfile } from '../hooks/useProfile';

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  login: (params: PostLoginParams) => Promise<void>;
  logout: () => void;
  disconnect: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

function hasSession() {
  return document.cookie.includes(`${COOKIE_AUTH_NAME}=`);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(hasSession());
  const [isLoading, setIsLoading] = useState(isAuthenticated);
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      setIsLoading(true);
      try {
        const data = await queryClient.fetchQuery({
          queryKey: ['profile'],
          queryFn: async () => (await client.profile.me.$get()).json(),
          staleTime: 5 * 60 * 1000,
        });
        setUser(data);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isAuthenticated, queryClient]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]) => {
    return !!user?.role && roles.includes(user.role);
  };

  const login = async ({ email, password }: PostLoginParams) => {
    await loginMutation.mutateAsync({ email, password });
    const data = await queryClient.fetchQuery({
      queryKey: ['profile'],
      queryFn: async () => (await client.profile.me.$get()).json(),
    });
    setUser(data as User);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
    setIsAuthenticated(false);
    queryClient.removeQueries({ queryKey: ['profile'] });
  };

  const disconnect = () => {
    setUser(null);
    setIsAuthenticated(false);
    queryClient.removeQueries({ queryKey: ['profile'] });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        hasRole,
        hasAnyRole,
        login,
        disconnect,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
