import Sidebar from "./sidebar";
import Navbar from "./navbar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from "recharts";

function Dashboard() {
  const data = [
    { name: "Income", value: 5000 },
    { name: "Expense", value: 3000 },
  ];

  const COLORS = ["#00C49F", "#FF4C4C"];

  return (
    <div style={styles.main}>
      <Sidebar />

      <div style={styles.content}>
        <Navbar />

        <div style={styles.cards}>
          <div style={styles.card}>Balance: ₹20,000</div>
          <div style={styles.card}>Credit Score: 750</div>
          <div style={styles.card}>Loan: Eligible</div>
        </div>

        <div style={styles.charts}>
          <div style={styles.chartBox}>
            <h3>Bar Chart</h3>
            <BarChart width={300} height={200} data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#667eea" />
            </BarChart>
          </div>

          <div style={styles.chartBox}>
            <h3>Pie Chart</h3>
            <PieChart width={300} height={200}>
              <Pie data={data} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  main: {
    display: "flex",
  },
  content: {
    flex: 1,
    background: "#f5f7fa",
  },
  cards: {
    display: "flex",
    gap: "15px",
    padding: "20px",
  },
  card: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },
  charts: {
    display: "flex",
    gap: "20px",
    padding: "20px",
  },
  chartBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },
};

export default Dashboard;