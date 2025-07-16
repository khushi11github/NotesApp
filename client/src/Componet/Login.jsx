import React, { useState } from "react";
import { Typography, Button, TextField, Box } from "@mui/material";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
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
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("loggedin", true);

      alert("Login successful");
      window.location.href = "/folder";
    } else {
      alert(data.error);
    }
  };

  return (
<Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh" // full vertical screen
      bgcolor="#c2f5daff" // optional background color
    >
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="400px"
        maxWidth="90%"
        padding={4}
        borderRadius="12px"
        boxShadow={2}
        bgcolor="#98cd99ff"
      >
        <Typography variant="h3" sx={{ color: "ActiveBorder", marginBottom: 4 ,fontSize: "4rem",fontWeight: "bold"}}>
          Login
        </Typography>

        <TextField
          name="email"
          type="email"
          label="Email"
          variant="filled"
          onChange={handleChange}
          sx={{ marginBottom: "20px", width: "300px" }}
        />

        <TextField
          name="password"
          type="password"
          label="Password"
          variant="filled"
          onChange={handleChange}
          sx={{ marginBottom: "30px", width: "300px" }}
        />

        <Button
          variant="contained"
          sx={{ backgroundColor: "#318e46ff", borderRadius: "20px" }}
          size="large"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
