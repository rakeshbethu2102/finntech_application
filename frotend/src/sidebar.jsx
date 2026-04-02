import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Fintech</h2>

      <div style={styles.menu}>
        <p onClick={() => navigate("/dashboard")}>Dashboard</p>
        <p>Transactions</p>
        <p>Analytics</p>
        <p>Settings</p>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#1e1e2f",
    color: "#fff",
    padding: "20px",
  },
  logo: {
    marginBottom: "30px",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    cursor: "pointer",
  },
};

export default Sidebar;