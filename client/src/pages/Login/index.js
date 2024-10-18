import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from "../../contexts/UserContext";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho toast
import "./Login.scss";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:9999/api/auth/login", {
        email: username,
        password: password,
      });
      login(response.data.accessToken); 
      console.log("chuyển trang /");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage); 
      console.error("Login error", error);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const res = await axios.post("http://localhost:9999/api/auth/google-login", {
        token: response.credential,
      });
      login(res.data.accessToken); 
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Google login failed. Please try again.";
      toast.error(errorMessage); 
      console.error("Google login error", error);
    }
  };

  return (
    <div className="login-page-container">
      <ToastContainer /> 
      <div className="image-section">
        <img
          src="https://daihoc.fpt.edu.vn/en/wp-content/uploads/2022/09/thu-vien-can-tho-6.jpg"
          alt="Login"
        />
      </div>
      <div className="login-section">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={handleGoogleLogin}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
