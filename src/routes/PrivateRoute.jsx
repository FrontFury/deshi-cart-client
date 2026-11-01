import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import CustomLoader from "../pages/Shared/CustomLoader/CustomLoader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  console.log(location)

  if (loading) {
    return <CustomLoader />;
  }

  if (!user) {
    return <Navigate state={location.pathname} to="/signIn"  />;
  }

  return children;
};

export default PrivateRoute;