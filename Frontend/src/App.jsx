import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UserSignup from "./pages/UserSignup";
import UserLogin from "./pages/UserLogin";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Start from "./pages/Start";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import UserLogout from "./pages/UserLogout";
import CaptainHome from "./pages/CaptainHome";
import CaptainLogout from "./pages/CaptainLogout";
import BrowseBooks from "./pages/BrowseBooks";
import BookDetail from "./pages/BookDetail";
import MyLibrary from "./pages/MyLibrary";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />}></Route>
        <Route path="/reader-signup" element={<UserSignup />}></Route>
        <Route path="/reader-login" element={<UserLogin />}></Route>
        <Route path="/librarian-signup" element={<CaptainSignup />}></Route>
        <Route path="/librarian-login" element={<CaptainLogin />}></Route>
        <Route
          path="/home"
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        ></Route>
        <Route
          path="/user/logout"
          element={
            <UserProtectedWrapper>
              <UserLogout></UserLogout>
            </UserProtectedWrapper>
          }
        ></Route>
        <Route path="/captain/home" element={<CaptainHome />}></Route>
        <Route
          path="/captain/logout"
          element={<CaptainLogout></CaptainLogout>}
        ></Route>
        <Route
          path="/browse"
          element={
            <UserProtectedWrapper>
              <BrowseBooks />
            </UserProtectedWrapper>
          }
        ></Route>
        <Route
          path="/book/:bookId"
          element={
            <UserProtectedWrapper>
              <BookDetail />
            </UserProtectedWrapper>
          }
        ></Route>
        <Route
          path="/my-library"
          element={
            <UserProtectedWrapper>
              <MyLibrary />
            </UserProtectedWrapper>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
