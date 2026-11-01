import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useSellerProducts = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  return useQuery({
    queryKey: ["products", "seller", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/api/products?sellerEmail=${encodeURIComponent(user.email)}`,
      );
      return response.data;
    },
    enabled: Boolean(user?.email),
  });
};

export default useSellerProducts;
