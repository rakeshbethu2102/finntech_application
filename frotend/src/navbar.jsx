import { useNavigate } from "react-router-dom";
import "./navbar.css";
function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("fintechUser"));
  
  const handleLogout = () => {
    localStorage.removeItem("fintechUser");
    navigate("/login");
  };

  return (
    <div className="nav">
      <div className="nav-left">
        <h3 className="nav-title">💰 FinTech Dashboard</h3>
        <div className="nav-links">
          <button 
            className="nav-link" 
            onClick={() => navigate("/dashboard")}
          >
            📊 Dashboard
          </button>
          {["analyst", "admin"].includes(user?.role) && (
            <button 
              className="nav-link" 
              onClick={() => navigate("/user-list")}
            >
              👥 Users
            </button>
          )}
          {user?.role === "admin" && (
            <button 
              className="nav-link" 
              onClick={() => navigate("/user-management")}
            >
              ⚙️ Manage
            </button>
          )}
        </div>
      </div>
      <div className="nav-right">
        <span className="user-info">
          {user?.name} <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
        </span>
        <button className="nav-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;