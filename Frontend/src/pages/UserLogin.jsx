import { useState } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  // const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setAlert("");
    const userData = { email: email, password: password };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/login`,
        userData
      );

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("token", data.token);
        localStorage.setItem("pathsala_user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/home");
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setAlert(error.response.data.message || "Invalid email or password");
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
          {alert && (
            <div className="bg-black text-white p-3 rounded mb-5 text-center">
              {alert}
            </div>
          )}
          <button className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5">
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          New here? 
          <Link to="/reader-signup" className="text-gray-700 hover:text-black">
            Create new account.
          </Link>
        </p>
        <div className="mt-8">
          <Link
            to="/librarian-login"
            className="bg-black flex items-center justify-center text-white font-semibold rounded px-4 py-2 w-full text-lg"
          >
            Sign in as Librerian
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
export default UserLogin;
