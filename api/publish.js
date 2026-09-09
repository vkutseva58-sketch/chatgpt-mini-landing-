const OWNER = "vkutseva58-sketch";
const REPO = "chatgpt-mini-landing-";
const BRANCH = "main";
const CONTENT_PATH = "content.json";
const TEST_PASSWORD = process.env.ADMIN_PASSWORD || "000";

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function encodeBase64Utf8(value) {
  return Buffer.from(value, "utf8").toString("base64");
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    return send(res, 200, {
      ok: true,
      configured: Boolean(process.env.GITHUB_TOKEN),
      passwordMode: process.env.ADMIN_PASSWORD ? "environment" : "test-default"
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { ok: false, error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); }
    catch { return send(res, 400, { ok: false, error: "Некорректный JSON" }); }
  }

  if (!body || body.password !== TEST_PASSWORD) {
    return send(res, 401, { ok: false, error: "Неверный пароль админки" });
  }

  if (!process.env.GITHUB_TOKEN) {
    return send(res, 503, {
      ok: false,
      error: "На Vercel ещё не настроена переменная GITHUB_TOKEN"
    });
  }

  if (!body.content || typeof body.content !== "object" || Array.isArray(body.content)) {
    return send(res, 400, { ok: false, error: "Не передан объект content" });
  }

  const token = process.env.GITHUB_TOKEN;
  const api = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${CONTENT_PATH}`;
  const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "chatgpt-mini-landing-admin"
  };

  try {
    const currentResponse = await fetch(`${api}?ref=${encodeURIComponent(BRANCH)}`, {
      headers,
      cache: "no-store"
    });

    if (!currentResponse.ok) {
      const details = await currentResponse.text();
      return send(res, 502, {
        ok: false,
        error: `GitHub не отдал текущий content.json (${currentResponse.status})`,
        details: details.slice(0, 500)
      });
    }

    const current = await currentResponse.json();
    const nextText = JSON.stringify(body.content, null, 2) + "\n";

    const updateResponse = await fetch(api, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Update landing content from web admin",
        content: encodeBase64Utf8(nextText),
        sha: current.sha,
        branch: BRANCH
      })
    });

    const result = await updateResponse.json();

    if (!updateResponse.ok) {
      return send(res, 502, {
        ok: false,
        error: result.message || `GitHub update failed (${updateResponse.status})`
      });
    }

    return send(res, 200, {
      ok: true,
      commit: result.commit && result.commit.sha ? result.commit.sha : null
    });
  } catch (error) {
    return send(res, 500, {
      ok: false,
      error: error && error.message ? error.message : "Неизвестная ошибка"
    });
  }
};
