import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { auth } from "../firebase/firebase.init";

const readRole = (payload) => {
  const value = payload?.role
    || payload?.userRole
    || payload?.data?.role
    || payload?.data?.userRole
    || payload?.user?.role
    || payload?.data?.user?.role
    || (typeof payload === "string" ? payload : "");

  return String(value).trim().toLowerCase();
};

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    isLoading: roleLoading,
    data: role = "customer",
    error: roleError,
  } = useQuery({
    queryKey: ["user-role", user?.uid, user?.email],
    queryFn: async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Firebase user is not available");

      const tokenResult = await currentUser.getIdTokenResult(true);
      const claimRole = readRole(tokenResult?.claims);
      if (claimRole) return claimRole;

      const email = encodeURIComponent(user.email.trim().toLowerCase());
      const response = await axiosSecure.get(`/api/users/role/${email}`, {
        headers: {
          authorization: `Bearer ${tokenResult.token}`,
        },
      });
      const responseRole = readRole(response.data);
      if (!responseRole) throw new Error("The role API returned no role");
      return responseRole;
    },
    enabled: Boolean(user?.email),
    retry: 1,
    throwOnError: false,
  });

  return { role, roleLoading, roleError };
};

export default useRole;
