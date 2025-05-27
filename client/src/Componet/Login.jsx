import React, { useState } from "react";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (res.ok) {
      // Save important data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);

      alert("Login successful");
      window.location.href = "/";
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input name="email" placeholder="Email" onChange={handleChange} /><br/>
      <input name="password" placeholder="Password" type="password" onChange={handleChange} /><br/>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
