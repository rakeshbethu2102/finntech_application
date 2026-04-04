import { useNavigate } from "react-router-dom";
import "./sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

   return (
    <div className="sidebar">
      <h2 className="logo">Fintech</h2>

      <div className="menu">
        <p
          className="menu-item"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </p>

        <p className="menu-item">Transactions</p>
        <p className="menu-item">Analytics</p>
        <p className="menu-item">Settings</p>
      </div>
    </div>
  );
}



export default Sidebar;