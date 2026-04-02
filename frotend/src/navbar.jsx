function Navbar() {
  return (
    <div style={styles.nav}>
      <h3>Dashboard</h3>
      <button style={styles.btn}>Logout</button>
    </div>
  );
}

const styles = {
  nav: {
    height: "60px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  btn: {
    padding: "8px 15px",
    border: "none",
    background: "#667eea",
    color: "#fff",
    borderRadius: "6px",
  },
};

export default Navbar;