import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function VendorRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "vendor") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
