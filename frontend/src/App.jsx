import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import { userDataContext } from "./context/UserContext.jsx";
import Network from "./pages/Network";
import Profile from "./pages/Profile.jsx";
import Notification from "./pages/Notification.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ConversationsList from "./pages/ConversationsList.jsx";
import NotFound from "./pages/NotFound.jsx";
import Ai from "./components/Ai.jsx";

function App() {
  let { userData } = useContext(userDataContext);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={userData ? <Navigate to="/" /> : <SignUp />}
        />
        <Route
          path="/login"
          element={userData ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/network"
          element={userData ? <Network /> : <Navigate to="/login/" />}
        />

        <Route
          path="/chat/:userId"
          element={userData ? <ChatPage /> : <Navigate to="/login/" />}
        />

        <Route
          path="/conversations"
          element={userData ? <ConversationsList /> : <Navigate to="/login/" />}
        />

        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/login/" />}
        />

        <Route
          path="/notification"
          element={userData ? <Notification /> : <Navigate to="/login/" />}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Ai />
    </>
  );
}

export default App;
