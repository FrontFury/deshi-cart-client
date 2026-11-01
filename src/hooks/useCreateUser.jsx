import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useCreateUser = () => {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async (userData) => {
      try {
        const response = await axiosSecure.post("/api/users", userData);
        return response.data;
      } catch (error) {
        if (error.response?.status === 409) {
          return { alreadyExists: true };
        }
        throw error;
      }
    },
  });
};

export default useCreateUser;
