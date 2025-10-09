import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { ROLE } from 'common/constants';
import { useUsers } from '../../../../hooks/useUsers.ts';
import './index.css';

export const Route = createFileRoute('/_auth/admin/users/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const allowedRoles = [ROLE.ADMIN];
    if (!context.auth.hasAnyRole(allowedRoles)) {
      throw redirect({ to: '/home' });
    }
  },
});

function RouteComponent() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <p>Loading users…</p>;
  if (error) return <p className="error">Error loading users</p>;
  if (!users?.length) return <p>No users found.</p>;

  return (
    <div className="admin-container">
      <h1>User Management</h1>
      <Link to="/admin/users/new">Create New User</Link>
      <br />
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <Link to="/admin/users/$userId" params={{ userId: u.id }}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
