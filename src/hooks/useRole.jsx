import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isLoading: roleLoading, data: role = "customer" } = useQuery({
    queryKey: ["user-role", user?.uid, user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/api/users/role/${encodeURIComponent(user.email)}`);
      const data = response.data;
      return String(data?.role || data?.userRole || data || "customer").toLowerCase();
    },
    enabled: Boolean(user?.email),
    retry: false,
    throwOnError: false,
  });

  return { role, roleLoading };
};

export default useRole;
