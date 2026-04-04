import { Routes, Route } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import Dashboard from "./dashboard";
import AddTransaction from "./addTransaction";
import UserList from "./userList";
import UserDetails from "./userDetails";
import UserManagement from "./userManagement";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-transaction" element={<AddTransaction />} />
      <Route path="/user-list" element={<UserList />} />
      <Route path="/user-details/:userId" element={<UserDetails />} />
      <Route path="/user-management" element={<UserManagement />} />
    </Routes>
  )
}


