import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";

function CaptainSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const { captain, setCaptain } = useContext(CaptainDataContext);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      fullname: {
        firstname: firstname,
      },
      email: email,
      password: password,
    };
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/register`,
      captainData
    );

    if (response.status === 201) {
      const data = response.data;
      localStorage.setItem("token", data.token);
      setCaptain(data.captain);
      navigate("/librarian-login");
    }

    setFirstname("");
    setEmail("");
    setPassword("");
  };
  return (
    <div className="py-5 px-5 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src="https://toppng.com/uploads/preview/uber-logo-png-transparent-background-11661767218bpqhia5qmj.png"
          alt=""
        />
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
              className="bg-[#eeeeee] w-full rounded px-4 py-2 border text-base placeholder:text-sm"
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
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
          />
          <h3 className="text-base font-medium mb-2">Enter Password</h3>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
            required
            type="password"
            placeholder="password"
          />
          <button className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5">
            Create Captain Account
          </button>
        </form>
        <p className="text-center">
          Already have an account?
          <Link to="/librarian-login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
      <div>
        <p
          className="
        text-[10px] "
        >
          This site is protected by reCAPTCHA and the
          <span className="">Google Privacy Policy</span> and
          <span className="">Terms of Service apply.</span>
        </p>
      </div>
    </div>
  );
}
export default CaptainSignup;
