import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { ROLE } from 'common/constants';
import { useAuth } from '../../../context/auth.context';

export const Route = createFileRoute('/_auth/_user/home')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const allowedRoles = [ROLE.USER, ROLE.ADMIN];
    if (!context.auth.hasAnyRole(allowedRoles)) {
      throw redirect({
        to: '/admin/users',
      });
    }
  },
});

function RouteComponent() {
  const { user, hasRole } = useAuth();
  return (
    <>
      <div className="p-2">Hello {user?.email || 'User'}</div>
      <br />
      <Link to="/">Go to Public Home</Link>
      {hasRole(ROLE.ADMIN) && (
        <>
          <br />
          <Link to="/admin/users">Go to Admin Users</Link>
        </>
      )}
    </>
  );
}
