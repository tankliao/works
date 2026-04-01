const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { password, reportData } = JSON.parse(event.body || "{}");
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tiktok2024";

  if (password !== ADMIN_PASSWORD) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "密碼錯誤" }),
    };
  }

  if (!reportData) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "缺少報告數據" }),
    };
  }

  try {
    const store = getStore("reports");
    await store.setJSON("latest", {
      ...reportData,
      savedAt: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, message: "報告已儲存！" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "儲存失敗：" + err.message }),
    };
  }
};
```

建完後確認 GitHub 的結構應該是：
```
works/
└── netlify/
    └── functions/
        ├── get-report.js   ✅
        └── save-report.js  ✅
