import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { ROLE } from 'common/constants';
import { ErrorMessage } from '../../../../components/error.alert';
import { UserForm } from '../../../../components/user.form';
import { usePostUser } from '../../../../hooks/useUsers';

export const Route = createFileRoute('/_auth/admin/users/new')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.hasAnyRole([ROLE.ADMIN])) throw redirect({ to: '/home' });
  },
});

function RouteComponent() {
  const createUser = usePostUser();

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Create user</h1>
      <UserForm
        mode="create"
        initial={{ email: '' }}
        onSubmit={(v) => createUser.mutateAsync(v)}
        submitLabel="Create"
      />
      <ErrorMessage error={createUser.error} className="error" />
      {createUser.status === 'success' && <p>User created successfully!</p>}
      <p>
        <Link to="/admin/users">Back</Link>
      </p>
    </div>
  );
}
