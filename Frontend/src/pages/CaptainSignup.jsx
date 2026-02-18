import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";

function CaptainSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [userDate, setUserDate] = useState({});
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const { captain, setCaptain } = useContext(CaptainDataContext);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        vehicleType: vehicleType, // should be one of: "car", "motorcycle", "auto"
      },
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
    setLastname("");
    setEmail("");
    setPassword("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
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
              className="bg-[#eeeeee] w-1/2  rounded px-4 py-2 border text-base placeholder:text-sm"
            />
            <input
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              type="text"
              required
              placeholder="Last name"
              className="bg-[#eeeeee] w-1/2  rounded px-4 py-2 border text-base placeholder:text-sm"
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
          <h3 className="text-base font-medium mb-2">Vehicle Information</h3>
          <input
            type="text"
            required
            placeholder="Vehicle color"
            className="bg-[#eeeeee] mb-3 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
          />
          <input
            type="text"
            required
            placeholder="Vehicle plate"
            className="bg-[#eeeeee] mb-3 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
          />
          <input
            type="number"
            required
            min={1}
            placeholder="Vehicle capacity"
            className="bg-[#eeeeee] mb-3 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
            value={vehicleCapacity}
            onChange={(e) => setVehicleCapacity(e.target.value)}
          />
          <select
            required
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-base"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="">Select vehicle type</option>
            <option value="car">Car</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="auto">Auto</option>
          </select>
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
