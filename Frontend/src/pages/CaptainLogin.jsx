import React from "react";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
function CaptainLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captainData, setCaptainData] = useState({});
  const { captain, setCaptain } = useContext(CaptainDataContext);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = { email: email, password: password };
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/captains/login`,
      captainData
    );
    if (response.status === 200) {
      const data = response.data;
      localStorage.setItem("token", data.token);
      setCaptain(data.captain);
      navigate("/captain/home");
    }

    setEmail("");
    setPassword("");
  };
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-lg">
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            required
            placeholder="example@email.com"
            className="bg-gray-100 mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
          />
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-gray-100 mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            required
            type="password"
            placeholder="password"
          />
          <button className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5">
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Join wisdom class?
          <Link to="/librarian-signup" className="text-gray-700 hover:text-black">
            Register as a Librarian
          </Link>
        </p>
        <div className="mt-8">
          <Link
            to="/reader-login"
            className="bg-black flex items-center justify-center text-white font-semibold rounded px-4 py-2 w-full text-lg"
          >
            Sign in as Reader
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
export default CaptainLogin;
