import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

function UserSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [userDate, setUserDate] = useState({});
  const [alert, setAlert] = useState("");

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setAlert("");
    const newUser = {
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );
      if (response.status === 201) {
        const data = response.data;
        localStorage.setItem("pathsala_user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        navigate("/reader-login");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setAlert(error.response.data.message || "User already exists.");
      } else {
        setAlert("An error occurred. Please try again.");
      }
    }
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
          <h3 className="text-base font-medium mb-2">What's your full name</h3>
          <div className="flex gap-3 mb-5">
            <input
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              type="text"
              required
              placeholder="First name"
              className="bg-gray-100 w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm"
            />
            <input
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              type="text"
              required
              placeholder="Last name"
              className="bg-gray-100 w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm"
            />
          </div>
          <h3 className="text-base font-medium mb-2">What's your email</h3>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            required
            placeholder="example@email.com"
            className="bg-gray-100 mb-5 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
          />
          <h3 className="text-base font-medium mb-2">Enter Password</h3>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-gray-100 mb-5 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
            required
            type="password"
            placeholder="password"
          />
          {alert && (
            <div className="bg-black text-white p-3 rounded mb-5 text-center">
              {alert}
            </div>
          )}

          <button className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5">
            Create account
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?
          <Link to="/reader-login" className="text-gray-700 hover:text-black">
            Login
          </Link>
        </p>
        <p className="text-[10px] mt-8 text-gray-600">
          By proceeding, you consent to get calls, WhatsApp or SMS messages,
          including by automated means, from Uber and its affiliates to the
          number provide.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
export default UserSignup;
