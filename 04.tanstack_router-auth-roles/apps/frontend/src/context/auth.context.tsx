import { useQueryClient } from '@tanstack/react-query';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { COOKIE_AUTH_NAME } from '../config/cookies.constant';
import { useLogin, useLogout } from '../hooks/useAuth';
import type { User } from '../hooks/useProfile';
import { client } from '../lib/hc';

type PostLoginParams = { email: string; password: string };

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  login: (params: PostLoginParams) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
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
          queryFn: async () => {
            const res = await client.profile.me.$get();
            if (!res.ok) throw new Error('Failed to fetch profile');
            return (await res.json()) as User;
          },
        });
        setUser(data);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        queryClient.removeQueries({ queryKey: ['profile'] });
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isAuthenticated, queryClient]);

  const hasRole = useCallback(
    (role: string) => {
      return user?.role === role;
    },
    [user?.role],
  );

  const hasAnyRole = useCallback(
    (roles: string[]) => {
      return !!user?.role && roles.includes(user.role);
    },
    [user?.role],
  );

  const refreshProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ['profile'],
        queryFn: async () => {
          const res = await client.profile.me.$get();
          if (!res.ok) throw new Error('Failed to fetch profile');
          return await res.json();
        },
      });

      setUser(data);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      queryClient.removeQueries({ queryKey: ['profile'] });
      console.error('Error fetching profile:', error);
    }
  }, [isAuthenticated, queryClient]);

  const login = useCallback(
    async ({ email, password }: PostLoginParams) => {
      await loginMutation.mutateAsync({ email, password });
      const data = await queryClient.fetchQuery({
        queryKey: ['profile'],
        queryFn: async () => {
          const res = await client.profile.me.$get();
          if (!res.ok) throw new Error('Failed to fetch profile');
          return await res.json();
        },
      });
      queryClient.setQueryData(['profile'], data);
      setUser(data);
      setIsAuthenticated(true);
    },
    [loginMutation, queryClient],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
    setIsAuthenticated(false);
    queryClient.removeQueries({ queryKey: ['profile'] });
  }, [logoutMutation, queryClient]);

  const disconnect = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    queryClient.removeQueries({ queryKey: ['profile'] });
  }, [queryClient]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        hasRole,
        hasAnyRole,
        login,
        refreshProfile,
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
