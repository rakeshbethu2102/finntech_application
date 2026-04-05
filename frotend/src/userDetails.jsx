import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./userDetails.css";
import { apiUrl } from "./api";

export default function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("fintechUser"));

  useEffect(() => {
    // Redirect if user doesn't have permission
    if (!user || !["analyst", "admin"].includes(user.role)) {
      navigate("/dashboard");
      return;
    }
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        apiUrl(`/api/users/${userId}/transactions`),
        {
          headers: {
            "x-user-role": user.role,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      setUserData(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="user-details-container"><p>Loading user details...</p></div>;
  }

  if (error) {
    return (
      <div className="user-details-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate("/user-list")} className="back-button">
          ← Back to Users
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="user-details-container">
        <p>User not found</p>
        <button onClick={() => navigate("/user-list")} className="back-button">
          ← Back to Users
        </button>
      </div>
    );
  }

  const { user: targetUser, stats, transactions } = userData;

  return (
    <div className="user-details-container">
      <button onClick={() => navigate("/user-list")} className="back-button">
        ← Back to Users
      </button>

      <div className="user-header">
        <div className="user-info">
          <h1>{targetUser.name}</h1>
          <p className="email">{targetUser.email}</p>
          <div className="user-meta">
            <span className={`role-badge role-${targetUser.role}`}>
              {targetUser.role.toUpperCase()}
            </span>
            <span className={`status-badge ${targetUser.status}`}>
              {targetUser.status.toUpperCase()}
            </span>
            <span className="joined-date">
              Joined: {new Date(targetUser.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h2>Account Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Income</p>
            <p className="stat-value income">
              ${stats.totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Expense</p>
            <p className="stat-value expense">
              ${stats.totalExpense.toFixed(2)}
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Net Balance</p>
            <p className={`stat-value ${stats.netBalance >= 0 ? "income" : "expense"}`}>
              ${stats.netBalance.toFixed(2)}
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Transactions</p>
            <p className="stat-value">{stats.transactionCount}</p>
          </div>
        </div>
      </div>

      {Object.keys(stats.categoryTotals).length > 0 && (
        <div className="categories-section">
          <h2>Category Breakdown</h2>
          <div className="categories-list">
            {Object.entries(stats.categoryTotals).map(([category, total]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-amount">${total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="transactions-section">
        <h2>Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="no-transactions">No transactions found</p>
        ) : (
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id}>
                    <td>{new Date(txn.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`type-badge ${txn.type}`}>
                        {txn.type.toUpperCase()}
                      </span>
                    </td>
                    <td>{txn.category}</td>
                    <td className={txn.type}>
                      {txn.type === "income" ? "+" : "-"}${txn.amount.toFixed(2)}
                    </td>
                    <td>{txn.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
