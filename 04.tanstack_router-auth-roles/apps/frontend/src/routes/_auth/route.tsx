import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
          reason: 'not_logged',
        },
      });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
