const { TableClient, TableServiceClient } = require("@azure/data-tables");

const CONN = process.env.AZURE_STORAGE_CONNECTION_STRING;

const TABLES = ["jobs", "workers", "leave", "users", "threads", "history"];

let _ensured = false;
async function ensureTables() {
  if (_ensured) return;
  if (!CONN) throw new Error("AZURE_STORAGE_CONNECTION_STRING not set");
  const svc = TableServiceClient.fromConnectionString(CONN);
  for (const t of TABLES) {
    try { await svc.createTable(t); } catch (e) { /* exists */ }
  }
  _ensured = true;
}

function getClient(table) {
  if (!CONN) throw new Error("AZURE_STORAGE_CONNECTION_STRING not set");
  return TableClient.fromConnectionString(CONN, table);
}

// Write a single audit-log row. Best-effort: never throws.
async function logEvent({ user, action, entityType, entityId, entityName }) {
  try {
    await ensureTables();
    const client = getClient("history");
    const ts = new Date();
    // RowKey = reverse-sorted timestamp + rand for uniqueness
    const rkTs = String(9999999999999 - ts.getTime()).padStart(13,"0");
    const rand = Math.random().toString(36).slice(2,8);
    await client.createEntity({
      partitionKey: "event",
      rowKey: `${rkTs}_${rand}`,
      timestamp: ts.toISOString(),
      userName: (user && user.name) || "system",
      userEmail: (user && user.email) || "",
      action: action || "edit",
      entityType: entityType || "",
      entityId: String(entityId || ""),
      entityName: entityName || ""
    });
  } catch (e) {
    // Swallow: audit logging must never block the main request
    if (typeof console !== "undefined" && console.error) console.error("logEvent failed", e.message);
  }
}

// Auth: verify access code header against users table
async function authenticate(req) {
  const email = (req.headers["x-user-email"] || "").toLowerCase().trim();
  const code = (req.headers["x-user-code"] || "").trim();
  if (!email || !code) return null;
  await ensureTables();
  const client = getClient("users");
  try {
    const entities = client.listEntities({
      queryOptions: { filter: `email eq '${email.replace(/'/g, "''")}'` }
    });
    for await (const e of entities) {
      if (e.code === code) {
        return { name: e.name, email: e.email, role: e.role, code: e.code };
      }
    }
  } catch (e) { /* fall through */ }
  return null;
}

function unauth(context) {
  context.res = { status: 401, body: { error: "Unauthorized" } };
}

function requireAdmin(user) {
  return user && user.role === "admin";
}

function ok(context, body) {
  context.res = { status: 200, headers: { "Content-Type": "application/json" }, body };
}

function bad(context, msg, status = 400) {
  context.res = { status, body: { error: msg } };
}

module.exports = { ensureTables, getClient, authenticate, unauth, requireAdmin, ok, bad, logEvent };
