import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./userManagement.css";
import { apiUrl } from "./api";

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const user = JSON.parse(localStorage.getItem("fintechUser"));

  useEffect(() => {
    // Redirect if user is not admin
    if (!user || user.role !== "admin") {
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
          "x-user-role": "admin",
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

  const handleEdit = (userId, field, currentValue) => {
    setEditingId(userId);
    setEditingField(field);
    setEditingValue(currentValue);
  };

  const handleSave = async (userId) => {
    try {
      const endpoint = editingField === "status" ? "status" : "role";
      const response = await fetch(
        apiUrl(`/api/users/${userId}/${endpoint}`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-role": "admin",
          },
          body: JSON.stringify({
            [editingField]: editingValue,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();

      // Update the user in the list
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? data.user : u))
      );

      setSuccess(`User ${editingField} updated successfully`);
      setEditingId(null);
      setEditingField(null);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${userName}" and all their data?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/users/${userId}`), {
        method: "DELETE",
        headers: {
          "x-user-role": "admin",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
      setSuccess(`User "${userName}" deleted successfully`);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="user-management-container">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <div className="management-header">
        <div className="header-text">
          <h1>👥 User Management</h1>
          <p>Manage user roles and account status</p>
        </div>
        <div className="header-actions">
          <button className="btn-back" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {users.length === 0 ? (
        <p className="no-users">No users found</p>
      ) : (
        <div className="management-table">
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
              {users.map((usr) => (
                <tr key={usr._id}>
                  <td>{usr.name}</td>
                  <td>{usr.email}</td>
                  <td>
                    {editingId === usr._id && editingField === "role" ? (
                      <select
                        className="edit-select"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="analyst">Analyst</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`role-badge role-${usr.role}`}>
                        {usr.role.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingId === usr._id && editingField === "status" ? (
                      <select
                        className="edit-select"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span className={`status-badge ${usr.status}`}>
                        {usr.status.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td>{new Date(usr.createdAt).toLocaleDateString()}</td>
                  <td>
                    {editingId === usr._id ? (
                      <>
                        <button
                          className="save-btn"
                          onClick={() => handleSave(usr._id)}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => {
                            setEditingId(null);
                            setEditingField(null);
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-role-btn"
                          onClick={() => handleEdit(usr._id, "role", usr.role)}
                        >
                          Role
                        </button>
                        <button
                          className="edit-status-btn"
                          onClick={() => handleEdit(usr._id, "status", usr.status)}
                        >
                          Status
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(usr._id, usr.name)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
