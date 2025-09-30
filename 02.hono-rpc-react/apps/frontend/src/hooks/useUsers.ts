import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/fetchUsers";

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });
