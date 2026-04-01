const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch(e) {}

  const password = body.password;
  const reportData = body.reportData;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tiktok2024";

  if (password !== ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "password wrong" }) };
  }

  if (!reportData) {
    return { statusCode: 400, body: JSON.stringify({ error: "no data" }) };
  }

  try {
    const store = getStore("reports");
    await store.setJSON("latest", { ...reportData, savedAt: new Date().toISOString() });
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
