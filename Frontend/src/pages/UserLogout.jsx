import axios from "axios";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
function UserLogout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken") || localStorage.getItem("token");
  axios
    .get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("userToken");
        navigate("/reader-login");
      }
    });
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <p className="text-lg">Signing you out...</p>
      </main>
      <SiteFooter />
    </div>
  );
}

export default UserLogout;
