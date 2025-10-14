import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ErrorMessage } from '../components/error.alert';
import { useAuth } from '../context/auth.context';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/home' });
    }
  },
});

function RouteComponent() {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate({ to: '/home' });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (error) {
      setError(error as Error);
    }
  };

  return (
    <>
      <Link to="/register">Go to Register</Link>
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <h3 className="form-title">Login</h3>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button type="submit">Sign in</button>
          <ErrorMessage error={error} className="error" />
        </form>
      </div>
    </>
  );
}
