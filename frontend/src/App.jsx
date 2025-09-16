import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./App.css";

const toInsightItems = (value) => {
  if (typeof value !== "string") {
    if (Array.isArray(value)) return value.map(String);
    if (value && typeof value === "object" && "insights" in value) value = String(value.insights);
    else return [];
  }
  return value
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.replace(/^\s*(?:[-•]|\d+\.)\s*/,"").trim())
    .filter(Boolean);
};

function App() {
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error(err));
  }, []);

  const categoryData = Object.values(
    transactions.reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = { name: t.category, value: 0 };
      acc[t.category].value += Math.abs(t.amount);
      return acc;
    }, {})
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#8884D8"];

  const handleGetInsights = async () => {
    try {
      setLoading(true);
      setErrMsg("");
      const res = await fetch("http://localhost:5000/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to get insights");
      setInsights(typeof data.insights === "string" ? data.insights : (Array.isArray(data.insights) ? data.insights.join("\n") : ""));
    } catch (err) {
      setErrMsg(err.message || "Failed to get AI insights");
    } finally {
      setLoading(false);
    }
  };

  const insightItems = toInsightItems(insights);

  return (
    <div className="container">
      <h1>SmartFinance Dashboard</h1>

      <div className="row">
        {/* Left: Pie chart */}
        <section className="card">
          <h3 className="chart-title">Spending by Category</h3>
          {categoryData.length > 0 && (
            <PieChart width={380} height={300}>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                fill="#8884d8"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
          <button onClick={handleGetInsights} disabled={loading}>
            {loading ? "Generating insights..." : "Get AI Insights"}
          </button>
          {errMsg && <div style={{ marginTop: 8, color: "#a13d2d" }}>{errMsg}</div>}
        </section>

        {/* Right: Table */}
        <section className="card">
          <h3 className="chart-title">Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.description}</td>
                  <td className={t.amount < 0 ? "amount-neg" : "amount-pos"}>
                    {t.amount}
                  </td>
                  <td>{t.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* Insights below the row */}
      {insightItems.length > 0 && (
        <section className="insights">
          <h2>AI Insights</h2>
          <ul>
            {insightItems.map((line, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{
                  __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                }}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default App;
