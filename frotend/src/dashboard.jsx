import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import "./dashboard.css";
import { apiUrl } from "./api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    const storedUser = JSON.parse(localStorage.getItem("fintechUser"));
    if (!storedUser) {
      setUser(null);
      setSummary(null);
      setLoading(false);
      return;
    }

    setUser(storedUser);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        apiUrl(`/api/dashboard/summary?role=${storedUser.role}&userId=${storedUser._id}`)
      );
      const data = await response.json();
      if (!data.success) {
        setError(data.message || "Unable to load dashboard");
        setSummary(null);
      } else {
        setSummary(data);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data");
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const chartData = summary
    ? [
        { name: "Income", value: summary.totalIncome, color: "#10B981" },
        { name: "Expense", value: summary.totalExpense, color: "#EF4444" },
      ]
    : [];

  const categoryData = Object.entries(summary?.categoryTotals || {}).map(([name, value], index) => ({
    name,
    value,
    color: ["#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981", "#F97316"][index % 6]
  }));

  const COLORS = ["#00C49F", "#FF4C4C"];
  const viewerRoles = ["viewer", "user"];
  const canAdd = viewerRoles.includes(user?.role) || user?.role === "admin" || user?.role === "analyst";

  if (!user) {
    return (
      <div className="main">
        <Sidebar />
        <div className="content">
          <Navbar />
          <div className="welcome-section">
            <div className="welcome-card">
              <div className="welcome-icon">🔐</div>
              <h2>Welcome to FinTech Dashboard</h2>
              <p>Please login to access your financial data and insights.</p>
              <button className="btn-primary" onClick={() => navigate("/login")}>
                Login Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="main">
        <Sidebar />
        <div className="content">
          <Navbar />
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <h3>Loading your dashboard...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <Sidebar />
      <div className="content">
        <Navbar />

        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-message">
              <h1>Welcome back, {user.name || user.email}!</h1>
              <p className="subtitle">Here's your financial overview for today</p>
            </div>
            <div className="header-actions">
              <button className="btn-secondary" disabled={loading} onClick={fetchSummary}>
                <span className="btn-icon">⟳</span>
                {loading ? "Refreshing..." : "Refresh"}
              </button>
              {canAdd && (
                <button className="btn-primary" onClick={() => navigate("/add-transaction")}>
                  <span className="btn-icon">+</span>
                  Add Transaction
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="alert error-alert">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card income-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Income</h3>
              <p className="stat-value">₹{summary?.totalIncome?.toLocaleString() ?? 0}</p>
              <span className="stat-trend positive">+12.5%</span>
            </div>
          </div>

          <div className="stat-card expense-card">
            <div className="stat-icon">💸</div>
            <div className="stat-content">
              <h3>Total Expenses</h3>
              <p className="stat-value">₹{summary?.totalExpense?.toLocaleString() ?? 0}</p>
              <span className="stat-trend negative">-8.2%</span>
            </div>
          </div>

          <div className="stat-card balance-card">
            <div className="stat-icon">⚖️</div>
            <div className="stat-content">
              <h3>Net Balance</h3>
              <p className={`stat-value ${summary?.netBalance >= 0 ? 'positive' : 'negative'}`}>
                ₹{summary?.netBalance?.toLocaleString() ?? 0}
              </p>
              <span className="stat-trend neutral">This month</span>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-container">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Income vs Expenses</h3>
                <span className="chart-subtitle">Monthly overview</span>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Spending by Category</h3>
                <span className="chart-subtitle">Expense breakdown</span>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <div className="activity-header">
            <h3>Recent Transactions</h3>
            <button className="btn-link" onClick={() => navigate("/transactions")}>
              View All →
            </button>
          </div>

          <div className="activity-list">
            {summary?.recentActivity?.length ? (
              summary.recentActivity.map((txn) => (
                <div key={txn._id} className={`activity-item ${txn.type}`}>
                  <div className="activity-icon">
                    {txn.type === 'income' ? '📈' : '📉'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{txn.category}</div>
                    <div className="activity-meta">
                      {txn.type.toUpperCase()} • {new Date(txn.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`activity-amount ${txn.type}`}>
                    {txn.type === 'income' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h4>No transactions yet</h4>
                <p>Start by adding your first transaction to see activity here.</p>
                {canAdd && (
                  <button className="btn-primary" onClick={() => navigate("/add-transaction")}>
                    Add Transaction
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
