import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useSaveProfile = (type) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const endpoint = type === "seller" ? "/api/seller/profile" : "/api/customer/profile";

  return useMutation({
    mutationFn: async (profile) => {
      const response = await axiosSecure.post(endpoint, profile);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type, "profile"] });
      queryClient.refetchQueries({ queryKey: [type, "profile"] });
    },
  });
};

export default useSaveProfile;
