import { useState } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mainLogo from "../assets/main_logo.png";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = { email: email, password: password };
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/login`,
      userData
    );

    if (response.status === 200) {
      const data = response.data;
      localStorage.setItem("token",data.token)
      setUser(data.user);
      navigate("/home");
    }
    setEmail("");
    setPassword("");
  };
  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img className="w-16 mb-10" src={mainLogo} alt="Digital Library" />
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
          New here? 
          <Link to="/reader-signup" className="text-blue-600">
             Create new account.
          </Link>
        </p>
      </div>
      <div>
        <Link
          to="/librarian-login"
          className="bg-[#10b461] flex items-center justify-center mb-5 text-white font-semibold mb-7 rounded px-4 py-2 w-full text-lg placeholder:"
        >
          Sign in as Librerian
        </Link>
      </div>
    </div>
  );
}
export default UserLogin;
