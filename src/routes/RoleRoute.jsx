import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import CustomLoader from "../pages/Shared/CustomLoader/CustomLoader";
import ForbiddenPage from "../pages/Shared/ForbiddenPage/ForbiddenPage";

const RoleRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <CustomLoader />;
  }

  if (!user) {
    return <ForbiddenPage />;
  }

  if (!allowedRoles.includes(role?.role)) {
    return <ForbiddenPage />;
  }

  return children;
};

export default RoleRoute;