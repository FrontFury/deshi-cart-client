import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useProfile = (type) => {
  const axiosSecure = useAxiosSecure();
  const endpoint = type === "seller" ? "/api/seller/profile" : "/api/customer/profile";

  return useQuery({
    queryKey: [type, "profile"],
    queryFn: async () => {
      const response = await axiosSecure.get(endpoint);
      return response.data;
    },
    retry: false,
  });
};

export default useProfile;
