import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://desi-cart-server.vercel.app",
});

const useAxios = () => {
    
    return axiosSecure;
};

export default useAxios;