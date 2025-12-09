export default async function handler(req, res) {
  const target = req.query.url;
  if (!target) {
    res.status(400).send("Missing url parameter");
    return;
  }

  try {
    const response = await fetch(target, {
      method: req.method,
      headers: req.headers,
    });

    // Copy headers but strip iframe blockers
    const headers = {};
    response.headers.forEach((value, key) => {
      if (!["x-frame-options", "content-security-policy"].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });

    res.writeHead(response.status, headers);
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
