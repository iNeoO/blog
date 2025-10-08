import { createFileRoute, redirect } from '@tanstack/react-router';
import { ROLE } from 'common/constants';

export const Route = createFileRoute('/_auth/admin/home')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    console.log(context.auth.user);
    // const allowedRoles = [ROLE.ADMIN];
    // if (!context.auth.hasAnyRole(allowedRoles)) {
    //   throw redirect({
    //     to: '/home',
    //   });
    // }
  },
});

function RouteComponent() {
  return <div className="p-2">Hello Admin</div>;
}
