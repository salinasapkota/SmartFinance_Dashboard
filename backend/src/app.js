import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config(); // Load .env variables

const app = express();

app.use(cors());           // Allow frontend-backend communication
app.use(express.json());   // Parse JSON in request bodies
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});


// Mock Transactions Data
let transactions = [
  { id: 1, date: "2025-08-15", description: "Groceries", amount: -45.67, category: "Food" },
  { id: 2, date: "2025-08-14", description: "Salary", amount: 2500, category: "Income" },
  { id: 3, date: "2025-08-13", description: "Netflix Subscription", amount: -15.99, category: "Entertainment" },
  { id: 4, date: "2025-08-12", description: "Electricity Bill", amount: -60, category: "Utilities" },
];

// Route 1: Get Transactions
app.get("/api/transactions", (req, res) => {
  res.json(transactions);
});

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route 2: AI Insights
app.post("/api/ai-insights", async (req, res) => {
  console.log("[REQ] /api/ai-insights body:", req.body);

  const userTransactions = Array.isArray(req.body?.transactions)
    ? req.body.transactions
    : transactions;

  const formattedTransactions = userTransactions
    .map(t => `${t.date} - ${t.description} (${t.category}): $${t.amount}`)
    .join("\n");

  try {
    // Guard: make sure key is present
    if (!process.env.OPENAI_API_KEY) {
      console.error("[AI] Missing OPENAI_API_KEY");
      return res.status(500).json({ error: "Server misconfigured (no API key)" });
    }

    const prompt = `
      You are a personal finance assistant.
      Analyze the following transactions and provide 3–5 concise insights or recommendations for saving money:

      ${formattedTransactions}
    `;

    console.log("[AI] Calling OpenAI…");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const insights = response?.choices?.[0]?.message?.content || "No insights generated.";
    console.log("[AI] Success");
    return res.json({ insights });
  } catch (err) {
    // TEMP: make the error loud & informative so we can fix quickly
    const status = err?.status || err?.response?.status;
    const data = err?.response?.data;
    console.error("[AI] OpenAI error:", { status, message: err?.message, data });

    return res.status(500).json({
      error: "Failed to get AI insights",
      debug: { status, message: err?.message, data }
    });
  }
});




// Global error handler -> always return JSON instead of HTML
app.use((err, req, res, next) => {
  console.error("[ERR]", err);
  res.status(500).json({ error: "Internal Server Error", details: err.message || String(err) });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
