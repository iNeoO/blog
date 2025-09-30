import { useUsers } from "./hooks/useUsers";
import "./App.css";
import { ROLE } from "common/constants";

function App() {
  const { data, isLoading, isError } = useUsers();
  console.log(ROLE);
  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error!</div>
      ) : (
        <div>
          <h1>Users</h1>
          <ul>
            {data?.map((user) => (
              <li key={user.id}>
                {user.name} ({user.age})
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
