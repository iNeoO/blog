import { useUsers } from './hooks/useUsers';
import './App.css';
import { ROLE } from 'common/constants';

function App() {
  const { data, isLoading, isError } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error!</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>
            {user.name} ({user.age}) - {user.role}
          </li>
        ))}
      </ul>
      <p>Available roles: {Object.values(ROLE).join(', ')}</p>
    </div>
  );
}

export default App;
