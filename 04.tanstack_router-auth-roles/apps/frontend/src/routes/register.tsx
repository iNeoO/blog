import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ErrorMessage } from '../components/error.alert';
import { usePostUser } from '../hooks/useUsers';

export const Route = createFileRoute('/register')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/home' });
    }
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const {
    mutate: register,
    isPending,
    error,
  } = usePostUser({
    onSuccess: () => navigate({ to: '/login' }),
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    register({ email, password });
  };

  return (
    <>
      <Link to="/login">Go to Login</Link>
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <h3 className="form-title">Register</h3>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button type="submit" disabled={isPending}>
            {isPending ? 'Loading…' : 'Create account'}
          </button>
          <ErrorMessage error={error} className="error" />
        </form>
      </div>
    </>
  );
}
