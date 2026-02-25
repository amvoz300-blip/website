import express from "express";
import cors from "cors";
import session from "express-session";
import fetch from "node-fetch";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

app.get("/auth/discord", (req, res) => {
  const url =
    `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}` +
    `&response_type=code&scope=identify%20email`;

  res.redirect(url);
});

app.get("/auth/discord/callback", async (req, res) => {
  try {
    const code = req.query.code;

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI
      })
    });

    const tokenData = await tokenRes.json();

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const user = await userRes.json();

    req.session.user = user;

    res.redirect("http://127.0.0.1:5500/staff.html");
  } catch {
    res.redirect("/");
  }
});


app.post("/api/staff/apply", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Login required" });
  }

  try {
    const data = req.body;
    const user = req.session.user;

    await transporter.sendMail({
      from: `"ZeroStar Team" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: "New ZeroStar Staff Application",
      html: `
        <h2>New Staff Application</h2>
        <p><b>User:</b> ${user.username}#${user.discriminator}</p>
        <p><b>Email:</b> ${user.email}</p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `
    });

    await transporter.sendMail({
      from: `"ZeroStar Team" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Application Received ✅",
      html: `
        <h2>Hello ${user.username}!</h2>
        <p>Your staff application has been received.</p>
        <p>You will be contacted on Discord if selected.</p>
        <br>
        <b>— ZeroStar Team</b>
      `
    });

    await fetch(process.env.DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🛡 New Staff Application\nUser: ${user.username}#${user.discriminator}`
      })
    });

    res.json({ success: true });

  } catch {
    res.status(500).json({ success: false });
  }
});


app.listen(PORT, () => {
  console.log(`✅ ZeroStar backend running on http://localhost:${PORT}`);
});
