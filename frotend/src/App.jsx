import { Routes, Route } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import Dashboard from "./dashboard";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}


