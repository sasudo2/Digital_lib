import { Link } from "react-router-dom";
import main_logo from "../assets/main_logo.png";
function Start() {
  return (
    <>
      <div className="bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full ">
        <img className="w-40 mx-auto" src={main_logo} alt="" />
        <div className="bg-white pb-7 py-4 px-4">
          <h2 className="text-3xl font-bold">Get Started with Pathsala.com</h2>
          <Link
            to="/reader-login"
            className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5"
          >
            Continue
          </Link>
        </div>
      </div>
    </>
  );
}
export default Start;
