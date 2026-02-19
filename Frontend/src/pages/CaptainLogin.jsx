import React from "react";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import main_logo from "../assets/main_logo.png";
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
      `${import.meta.env.VITE_BASE_URL}/captains/login`,
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
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src={main_logo}
          alt=""
        />
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
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
          />
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            required
            type="password"
            placeholder="password"
          />
          <button className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5">
            Login
          </button>
        </form>
        <p className="text-center">
          Join wisdom class?
          <Link to="/librarian-signup" className="text-blue-600">
            Register as a Librarian
          </Link>
        </p>
      </div>
      <div>
        <Link
          to="/reader-login"
          className="bg-[#d5622d] flex items-center justify-center mb-5 text-white font-semibold mb-7 rounded px-4 py-2 w-full text-lg placeholder:"
        >
          Sign in as Reader
        </Link>
      </div>
    </div>
  );
}
export default CaptainLogin;
