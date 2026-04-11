let _loadError = null;
let shared;
try {
  shared = require("../shared/table");
} catch (e) {
  _loadError = e;
}

const PARTITION = "user";

const DEFAULT_USERS = [
  { name: "Craig",        email: "craig@topcon.com",                     code: "1234", role: "admin" },
  { name: "Allan",        email: "allan@velcorp.com",                    code: "5678", role: "admin" },
  { name: "Admin",        email: "apptestportal@outlook.com",            code: "9012", role: "admin" },
  { name: "Sadmin",       email: "sadmin@apptestportal.onmicrosoft.com", code: "3456", role: "admin" },
  { name: "Adam Clarke",  email: "adam.c@topcon.com.au",                 code: "1001", role: "user" },
  { name: "Ben Torres",   email: "ben.t@topcon.com.au",                  code: "1002", role: "user" },
  { name: "Chris Ray",    email: "chris.r@topcon.com.au",                code: "1003", role: "user" },
  { name: "Dan Smith",    email: "dan.s@topcon.com.au",                  code: "1004", role: "user" },
  { name: "Ed Walsh",     email: "ed.w@topcon.com.au",                   code: "1005", role: "user" },
  { name: "Frank Li",     email: "frank.l@topcon.com.au",                code: "1006", role: "user" },
  { name: "Gary Hunt",    email: "gary.h@topcon.com.au",                 code: "2001", role: "user" },
  { name: "Harry Fox",    email: "harry.f@topcon.com.au",                code: "2002", role: "user" },
  { name: "Ivan Marsh",   email: "ivan.m@topcon.com.au",                 code: "2003", role: "user" },
  { name: "Jake Owen",    email: "jake.o@topcon.com.au",                 code: "2004", role: "user" },
  { name: "Kyle Park",    email: "kyle.p@topcon.com.au",                 code: "2005", role: "user" },
  { name: "Leo James",    email: "leo.j@topcon.com.au",                  code: "2006", role: "user" },
];

function safeKey(email) {
  return email.toLowerCase().replace(/[^a-z0-9]/g, "_");
}

function toEntity(u) {
  return {
    partitionKey: PARTITION,
    rowKey: safeKey(u.email),
    name: u.name,
    email: u.email.toLowerCase(),
    code: u.code,
    role: u.role
  };
}
function fromEntity(e) {
  return { name: e.name, email: e.email, code: e.code, role: e.role };
}

async function seedIfEmpty(client) {
  const it = client.listEntities({ queryOptions: { filter: `PartitionKey eq '${PARTITION}'` } });
  for await (const _ of it) return; // has at least one
  for (const u of DEFAULT_USERS) await client.upsertEntity(toEntity(u), "Replace");
}

module.exports = async function (context, req) {
  if (_loadError) {
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: {
        error: "Module load failed",
        message: _loadError.message,
        stack: _loadError.stack,
        hasConnectionString: !!process.env.AZURE_STORAGE_CONNECTION_STRING
      }
    };
    return;
  }
  const { ensureTables, getClient, authenticate, unauth, requireAdmin, ok, bad } = shared;
  try {
    await ensureTables();
    const client = getClient("users");
    await seedIfEmpty(client);
    const action = req.query.action;

    // LOGIN: anonymous, body { email, code }
    if (req.method === "POST" && action === "login") {
      const { email, code } = req.body || {};
      if (!email || !code) return bad(context, "email and code required");
      const it = client.listEntities({
        queryOptions: { filter: `email eq '${email.toLowerCase().replace(/'/g, "''")}'` }
      });
      for await (const e of it) {
        if (e.code === code) return ok(context, fromEntity(e));
      }
      return bad(context, "Invalid credentials", 401);
    }

    // All other operations require auth
    const user = await authenticate(req);
    if (!user) return unauth(context);
    const emailParam = context.bindingData.email;

    if (req.method === "GET") {
      // Admins see all users; non-admins see nothing useful
      if (!requireAdmin(user)) return ok(context, []);
      const out = [];
      const it = client.listEntities({ queryOptions: { filter: `PartitionKey eq '${PARTITION}'` } });
      for await (const e of it) out.push(fromEntity(e));
      return ok(context, out);
    }

    if (req.method === "POST") {
      if (!requireAdmin(user)) return bad(context, "Admin only", 403);
      const body = req.body || {};
      if (Array.isArray(body)) {
        for (const u of body) await client.upsertEntity(toEntity(u), "Replace");
        return ok(context, { migrated: body.length });
      }
      if (!body.email) return bad(context, "email required");
      await client.upsertEntity(toEntity(body), "Replace");
      return ok(context, fromEntity(toEntity(body)));
    }

    if (req.method === "DELETE") {
      if (!requireAdmin(user)) return bad(context, "Admin only", 403);
      if (!emailParam) return bad(context, "email required");
      try { await client.deleteEntity(PARTITION, safeKey(emailParam)); } catch (e) {}
      return ok(context, { deleted: emailParam });
    }

    return bad(context, "Method not allowed", 405);
  } catch (err) {
    context.log.error("users function error:", err, err && err.stack);
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: {
        error: "Server error",
        message: err && err.message || String(err),
        stack: err && err.stack || null,
        hasConnectionString: !!process.env.AZURE_STORAGE_CONNECTION_STRING
      }
    };
  }
};
