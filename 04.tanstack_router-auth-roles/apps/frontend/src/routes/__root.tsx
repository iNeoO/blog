import { createRootRouteWithContext, HeadContent, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { AuthState } from '../context/auth.context';

interface RouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
