import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  axiosSecure.interceptors.request.use((config) => {
    const token = localStorage.getItem("access-token");
    if (token) config.headers.authorization = `Bearer ${token}`;
    return config;
  });

  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        await logOut();
        navigate("/login", { replace: true });
      }
      return Promise.reject(error);
    },
  );

  return axiosSecure;
};

export default useAxiosSecure;
