import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const RoleRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <div className="page empty-state">Loading your account...</div>;
  }

  if (!user) {
    return <main className="page empty-state"><h1>Access denied</h1><p>Please sign in to continue.</p></main>;
  }

  if (!allowedRoles.map((allowedRole) => allowedRole.toLowerCase()).includes(String(role).toLowerCase())) {
    return <main className="page empty-state"><h1>Access denied</h1><p>You do not have permission to view this page.</p></main>;
  }

  return children;
};

export default RoleRoute;