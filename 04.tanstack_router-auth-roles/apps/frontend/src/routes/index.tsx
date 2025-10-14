import { createFileRoute, Link } from '@tanstack/react-router';
import { useAuth } from '../context/auth.context';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      {isAuthenticated ? (
        <Link to="/home">Go to Home</Link>
      ) : (
        <>
          <Link to="/login">Go to Login</Link>
          <br />
          <Link to="/register">Go to Register</Link>
        </>
      )}
    </div>
  );
}
