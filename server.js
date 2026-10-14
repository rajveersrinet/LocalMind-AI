const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL || "qwen2.5:3b";

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!response.ok) throw new Error("Ollama did not respond");
    const data = await response.json();
    const models = (data.models || []).map((m) => m.name);
    res.json({ ok: true, provider: "ollama", model: MODEL, installed: models });
  } catch {
    res.json({ ok: false, provider: "demo", model: MODEL, message: "Ollama is not reachable. Demo mode is available." });
  }
});

app.post("/api/generate", async (req, res) => {
  const { task, details } = req.body || {};
  if (!["email", "invoice"].includes(task) || typeof details !== "object" || !details) {
    return res.status(400).json({ error: "Provide task ('email' or 'invoice') and details." });
  }

  const prompt = task === "email"
    ? `Write a concise, professional business email using only the supplied details. Do not invent facts. Include a subject line. If key details are missing, use clear placeholders.\nDetails:\n${JSON.stringify(details, null, 2)}`
    : `Summarize these invoice details for a freelancer. State the client, amount, due date, and status if provided. Flag missing fields; do not provide legal or tax advice and do not invent facts.\nDetails:\n${JSON.stringify(details, null, 2)}`;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        messages: [
          { role: "system", content: "You are LocalMind AI, a careful assistant for freelancers and small businesses. Be accurate, concise, and transparent about missing information." },
          { role: "user", content: prompt }
        ],
        options: { temperature: 0.3 }
      })
    });
    if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
    const data = await response.json();
    return res.json({ text: data.message?.content || "No response was returned.", mode: "local", model: MODEL });
  } catch {
    return res.json({ text: demoResponse(task, details), mode: "demo", model: MODEL });
  }
});

function demoResponse(task, d) {
  if (task === "email") {
    const purpose = d.purpose || "follow up";
    const name = d.client || "[Client name]";
    const sender = d.sender || "[Your name]";
    const amount = d.amount ? ` for ${d.currency || "INR"} ${d.amount}` : "";
    const due = d.dueDate ? ` The due date is ${d.dueDate}.` : "";
    return `Subject: Follow-up regarding ${purpose}\n\nHi ${name},\n\nI hope you are doing well. I am writing to ${purpose}${amount}.${due}\n\nPlease let me know if you need any additional information. Thank you for your time.\n\nBest regards,\n${sender}\n\n[Demo mode: connect Ollama for AI-generated results.]`;
  }
  return `Invoice summary\n\nClient: ${d.client || "Not provided"}\nAmount: ${d.currency || "INR"} ${d.amount || "Not provided"}\nDue date: ${d.dueDate || "Not provided"}\nStatus: ${d.status || "Not provided"}\n\nNext step: verify the details above and contact the client if the invoice is due. Missing details are shown as “Not provided”.\n\n[Demo mode: connect Ollama for AI-generated results.]`;
}

app.listen(PORT, () => {
  console.log(`LocalMind AI is running at http://localhost:${PORT}`);
  console.log(`Model: ${MODEL} | Ollama: ${OLLAMA_URL}`);
});