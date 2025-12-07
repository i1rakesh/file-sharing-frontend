import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f8f9fa",
  padding: "20px",
};

const cardStyle = {
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "400px",
  textAlign: "center",
};

const titleStyle = {
  marginBottom: "25px",
  color: "#343a40",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const inputStyle = {
  padding: "12px",
  border: "1px solid #ced4da",
  borderRadius: "5px",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "12px",
  backgroundColor: "#3fd465",
  color: "white",
  border: "none",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px",
  transition: "background-color 0.2s",
};

const linkTextStyle = {
  marginTop: "20px",
  fontSize: "14px",
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "none",
  fontWeight: "bold",
};

const notificationContainerStyle = (isVisible, isSuccess) => ({
  position: "fixed",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: isSuccess ? "#28a745" : "#dc3545", // Green for success, Red for error
  color: "white",
  padding: "15px 30px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  opacity: isVisible ? 1 : 0,
  transition: "opacity 0.5s, transform 0.5s",
  zIndex: 1000,
  pointerEvents: "none", // Allows clicking through when hidden
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      showNotification("Login successful!", "success");
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Server error";
      showNotification(`Login failed: ${errorMessage}`, "error");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Log In</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            style={inputStyle}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Log In
          </button>
        </form>
        <p style={linkTextStyle}>
          Don't have an account?{" "}
          <Link to="/register" style={linkStyle}>
            Register here
          </Link>
        </p>
      </div>

      <div
        style={notificationContainerStyle(
          notification.visible,
          notification.type === "success"
        )}
      >
        {notification.message}
      </div>
    </div>
  );
};

export default Login;
