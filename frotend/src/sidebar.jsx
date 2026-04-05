import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const syncMenuState = () => {
      setIsMobileMenuOpen(!mediaQuery.matches);
    };

    syncMenuState();
    mediaQuery.addEventListener("change", syncMenuState);

    return () => mediaQuery.removeEventListener("change", syncMenuState);
  }, []);

   return (
    <div className={`sidebar ${isMobileMenuOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        <h2 className="logo">Fintech</h2>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Collapse sidebar menu" : "Expand sidebar menu"}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`menu ${isMobileMenuOpen ? "menu-open" : "menu-closed"}`}>
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