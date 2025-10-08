import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { ROLE } from 'common/constants';
import { useAuth } from '../../../context/auth.context';

export const Route = createFileRoute('/_auth/_user/home')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    console.log(context.auth.user);
    // const allowedRoles = [ROLE.USER];
    // if (!context.auth.hasAnyRole(allowedRoles)) {
    //   throw redirect({
    //     to: '/admin/home',
    //   });
    // }
  },
});

function RouteComponent() {
  const { user } = useAuth();
  return (
    <>
      <div className="p-2">Hello {user?.email || 'User'}</div>
      <br />
      <Link to="/">Go to Public Home</Link>
    </>
  );
}
