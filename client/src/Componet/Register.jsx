import React, { useState } from "react";

function Register() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    console.log("Register clicked", form);
    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("name", form.name);
        localStorage.setItem("username", form.username);
        localStorage.setItem("email", form.email);

        alert("Registered Successfully");
        window.location.href = "/login";
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} /><br />
      <input name="username" placeholder="Username" value={form.username} onChange={handleChange} /><br />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} /><br />
      <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} /><br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
