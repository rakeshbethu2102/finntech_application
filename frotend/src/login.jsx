import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/auth/login", {
    method: "POST",   // 🔥 ADD THIS
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData), // 🔥 ADD THIS
  }) // ✅ FIXED URL
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.success) {
          localStorage.setItem("fintechUser", JSON.stringify(data.user));
          alert(`Login successful as ${data.user.role}`);
          navigate("/dashboard");
        } else {
          alert("Invalid credentials");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
  <div className="container">
    <div className="card">
      <h2 className="title">Welcome Back 👋</h2>
      <p className="subtitle">Login to your account</p>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="input"
          required
        />

        <div className="passwordWrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            required
          />
          <span
            className="eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit" className="btn">
          Login
        </button>
      </form>

      <p className="footer">
        Don't have an account?{" "}
        <span className="link" onClick={() => navigate("/register")}>
          Register
        </span>
      </p>
    </div>
  </div>
);
}


export default Login;