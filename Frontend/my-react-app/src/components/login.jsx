import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // Save token if your backend returns one
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setMessage("Login successful!");

      // Change this according to your dashboard route
      window.location.hash = "#/todo";

    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>

        <h1>Welcome Back</h1>

        <p>Login to manage your tasks</p>

        <label>EMAIL</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>PASSWORD</label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>

        {message && (
          <div className="login-message">
            {message}
          </div>
        )}

        <p>
          Don't have an account?{" "}
          <a href="#/register">Register</a>
        </p>

      </form>
    </div>
  );
}

export default Login;