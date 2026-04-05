import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./userList.css";
import { apiUrl } from "./api";

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const user = JSON.parse(localStorage.getItem("fintechUser"));

  useEffect(() => {
    // Redirect if user doesn't have permission
    if (!user || !["analyst", "admin"].includes(user.role)) {
      navigate("/dashboard");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl("/api/users"), {
        headers: {
          "x-user-role": user.role,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (userId) => {
    navigate(`/user-details/${userId}`);
  };

  const filteredUsers = users.filter((usr) => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;
    return (
      usr.name.toLowerCase().includes(keyword) ||
      usr.email.toLowerCase().includes(keyword) ||
      usr.role.toLowerCase().includes(keyword) ||
      usr.status.toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return <div className="user-list-container"><p>Loading users...</p></div>;
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <div className="header-left">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="header-subtitle">Browse users, inspect roles, and track account status.</p>
          </div>
        </div>

        <div className="header-right">
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, role or status"
          />
          <div className="header-actions">
            <button className="btn-back" onClick={() => navigate("/dashboard")}>← Dashboard</button>
            {user.role === "admin" && (
              <Link to="/user-management" className="management-button">
                ⚙️ Manage Users
              </Link>
            )}
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {users.length === 0 ? (
        <p className="no-users">No users found</p>
      ) : (
        <>
          <div className="users-summary">
            <span className="users-count">{filteredUsers.length} users found</span>
            {filteredUsers.length === 0 && (
              <span className="no-results">No users match your search.</span>
            )}
          </div>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((usr) => (
                  <tr key={usr._id}>
                    <td data-label="Name">{usr.name}</td>
                    <td data-label="Email">{usr.email}</td>
                    <td data-label="Role">
                      <span className={`role-badge role-${usr.role}`}>
                        {usr.role.toUpperCase()}
                      </span>
                    </td>
                    <td data-label="Status">
                      <span className={`status-badge ${usr.status}`}>
                        {usr.status.toUpperCase()}
                      </span>
                    </td>
                    <td data-label="Joined">{new Date(usr.createdAt).toLocaleDateString()}</td>
                    <td data-label="Actions">
                      <button
                        className="view-details-btn"
                        onClick={() => handleViewDetails(usr._id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
