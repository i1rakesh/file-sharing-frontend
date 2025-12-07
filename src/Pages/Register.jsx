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

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      alert("Registration successful! You are now logged in.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(
        "Registration failed: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Register</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            style={inputStyle}
          />
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
            Register
          </button>
        </form>
        <p style={linkTextStyle}>
          Already have an account?{" "}
          <Link to="/login" style={linkStyle}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
