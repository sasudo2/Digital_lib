import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
function CaptainLogout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/captains/logout`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("token");
        navigate("/captain-login");
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
export default CaptainLogout;
