require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Telegram Bot Configuration - Using your new bot token
const BOT_TOKEN = "8522041909:AAETf9GGd_K_82WpT5QoMvA059bv_-MlsRg";
const CHAT_ID = "6197878051"; // Your personal Telegram chat ID

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body || {};

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false,
        message: "Name, email, and message are required." 
      });
    }

    // Create formatted message for Telegram
    const telegramMessage = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "📩 **NEW PORTFOLIO CONTACT**",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      `👤 **Name:** ${name}`,
      `📧 **Email:** ${email}`,
      `📱 **Phone:** ${phone || "Not provided"}`,
      `🎯 **Service:** ${service || "Not specified"}`,
      "",
      "💬 **Message:**",
      `_${message}_`,
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `🌐 Source: Jim Rotha Portfolio Website`,
      `🕒 Time: ${new Date().toLocaleString()}`,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━"
    ].join("\n");

    // Send message to Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: telegramMessage,
        parse_mode: "Markdown"
      })
    });

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramData.ok) {
      console.error("Telegram API error:", telegramData);
      return res.status(500).json({
        success: false,
        message: telegramData.description || "Failed to send message via Telegram."
      });
    }

    console.log(`✅ Message sent to Telegram from ${name} (${email})`);
    
    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully! I'll get back to you soon."
    });
    
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error. Please try again later."
    });
  }
});

// Test endpoint to verify Telegram bot is working
app.get("/api/test-telegram", async (req, res) => {
  try {
    const testMessage = "🔔 *Test Message* \n\nYour Telegram bot is working correctly!";
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: testMessage,
        parse_mode: "Markdown"
      })
    });
    
    const data = await response.json();
    
    if (data.ok) {
      res.json({ success: true, message: "Telegram bot is working!" });
    } else {
      res.json({ success: false, error: data.description });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🤖 Telegram Bot configured: @jimrothaportfolio_Bot`);
  console.log(`📨 Messages will be sent to: Jim Rotha (${CHAT_ID})`);
  console.log(`✅ Test the bot at: http://localhost:${PORT}/api/test-telegram`);
});