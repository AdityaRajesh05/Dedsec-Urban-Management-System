import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Save the real token
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed. Check credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-6">
      <img
        src={logo}
        alt="Dedsec Logo"
        className="w-32 h-32 object-contain mb-6"
      />
      <h1 className="text-3xl font-bold mb-4">Urban Reporter</h1>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 rounded text-black"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 rounded text-black"
          required
        />

        <button
          type="submit"
          className="bg-white text-black py-2 rounded hover:bg-gray-200 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;