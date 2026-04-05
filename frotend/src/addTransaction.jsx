import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addTransaction.css";
import { apiUrl } from "./api";

function AddTransaction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "groceries",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const user = JSON.parse(localStorage.getItem("fintechUser"));
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const payload = {
      userId: user._id,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
      notes: formData.notes,
    };

    fetch(apiUrl("/api/transactions"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-role": user.role,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setSuccess(true);
          setFormData({
            amount: "",
            type: "expense",
            category: "groceries",
            date: new Date().toISOString().split("T")[0],
            notes: "",
          });
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } else {
          setError(data.message || "Failed to add transaction");
        }
      })
      .catch((err) => {
        setLoading(false);
        setError("Error: " + err.message);
        console.error(err);
      });
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Add Transaction</h2>
        <p className="subtitle">Record your income or expense</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">✅ Transaction added successfully! Redirecting...</div>}

        {!success && (
        <form onSubmit={handleSubmit} className="form">
          <label>Amount *</label>
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            className="input"
            step="0.01"
            required
          />

          <label>Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="groceries">Groceries</option>
            <option value="utilities">Utilities</option>
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="investment">Investment</option>
            <option value="entertainment">Entertainment</option>
            <option value="transport">Transport</option>
            <option value="healthcare">Healthcare</option>
            <option value="other">Other</option>
          </select>

          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input"
            required
          />

          <label>Notes</label>
          <textarea
            name="notes"
            placeholder="Add any notes (optional)"
            value={formData.notes}
            onChange={handleChange}
            className="input"
            rows="4"
          />

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Adding..." : "Add Transaction"}
          </button>
        </form>
        )}

        {!success && (
        <p className="footer">
          <span className="link" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </span>
        </p>
        )}
      </div>
    </div>
  );
}

export default AddTransaction;
