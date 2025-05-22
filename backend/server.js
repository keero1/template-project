const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const webPush = require("web-push");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// go generate keys; node generateVapidKeys.js
const vapidKeys = {
  publicKey:
    "BMHfaVvFNdU5WUktSPJmSZPobXrvmLcZGoqdHruwJBAHu3lF44LfNIoTVFLVwX8lDTXDdmto9dfftT29cUM0zuo",
  privateKey: "8j0Nh1yoKDFwQPntNEazn2i50evkcU5-eRN4mfJeS24",
};

webPush.setVapidDetails(
  "mailto:your@email.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let subscriptions = [];

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  console.log("📬 New subscription:", subscription);

  subscriptions.push(subscription);

  res.status(201).json({ message: "Subscription received" });
});

app.post("/unsubscribe", (req, res) => {
  const unsub = req.body;

  subscriptions = subscriptions.filter(
    (sub) => sub.endpoint !== unsub.endpoint
  );

  console.log("🧽 Unsubscribed:", unsub.endpoint);
  res.status(200).json({ message: "Unsubscribed successfully" });
});

app.get("/notify", async (req, res) => {
  const payload = JSON.stringify({
    title: "Hello!",
    body: "You have a new notification.",
  });

  try {
    const results = await Promise.all(
      subscriptions.map((sub) => webPush.sendNotification(sub, payload))
    );
    res.json({ message: "Notifications sent!", results });
  } catch (err) {
    console.error("Error sending notifications:", err);
    res.status(500).json({ error: "Push failed" });
  }
});

app.get("/send-notification", async (req, res) => {
  const payload = JSON.stringify({
    title: "🔔 StudioBase Notification",
    body: "This is a test push from the server!",
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) => webPush.sendNotification(sub, payload))
  );

  console.log("✅ Push results:", results);
  res.json({ message: "Notification sent" });
});

app.listen(PORT, () => {
  console.log(`Push server running on ${PORT}`);
});
