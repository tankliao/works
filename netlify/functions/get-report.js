const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    const store = getStore("reports");
    const data = await store.get("latest", { type: "json" });

    if (!data) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "尚無報告數據" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Get error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "讀取失敗：" + err.message }),
    };
  }
};
