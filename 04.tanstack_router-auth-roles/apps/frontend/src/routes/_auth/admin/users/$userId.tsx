import { createFileRoute, Link, redirect, useParams } from '@tanstack/react-router';
import { ROLE } from 'common/constants';
import { ErrorMessage } from '../../../../components/error.alert.tsx';
import { UserForm } from '../../../../components/user.form';
import { usePatchUser, useUser } from '../../../../hooks/useUsers.ts';

export const Route = createFileRoute('/_auth/admin/users/$userId')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.hasAnyRole([ROLE.ADMIN])) throw redirect({ to: '/home' });
  },
});

function RouteComponent() {
  const { userId } = useParams({ from: '/_auth/admin/users/$userId' });
  const { data, isLoading, error } = useUser(userId);
  const updateUser = usePatchUser();

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'red' }}>Failed to load user.</p>;
  if (!data) return <p>User not found.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Edit user</h1>
      <UserForm
        mode="edit"
        initial={{ email: data.email, role: data.role }}
        onSubmit={(v) => updateUser.mutateAsync({ id: userId, ...v })}
        submitLabel="Save changes"
      />
      <ErrorMessage error={updateUser.error} className="error" />
      {updateUser.status === 'success' && <p>User created successfully!</p>}
      <p>
        <Link to="/admin/users">Back</Link>
      </p>
    </div>
  );
}
