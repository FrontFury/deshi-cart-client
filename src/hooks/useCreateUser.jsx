import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData) => {
      try {
        const response = await axiosPublic.post("/api/users", userData);
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
