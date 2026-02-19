import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function UserProtectedWrapper({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken") || localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/reader-login");
    }
  }, [token]);
  return <>{children}</>;
}
export default UserProtectedWrapper;
