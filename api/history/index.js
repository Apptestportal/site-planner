const { ensureTables, getClient, authenticate, unauth, requireAdmin, ok, bad } = require("../shared/table");

const PARTITION = "event";
const RETENTION_DAYS = 60;

module.exports = async function (context, req) {
  try {
    const user = await authenticate(req);
    if (!user) return unauth(context);
    if (!requireAdmin(user)) return bad(context, "admin only", 403);
    await ensureTables();
    const client = getClient("history");

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
    const cutoffIso = cutoff.toISOString();

    // Best-effort prune: delete anything older than cutoff
    try {
      const toDelete = client.listEntities({ queryOptions: { filter: `PartitionKey eq '${PARTITION}' and timestamp lt '${cutoffIso}'` } });
      for await (const e of toDelete) {
        try { await client.deleteEntity(e.partitionKey, e.rowKey); } catch (_) {}
      }
    } catch (_) {}

    const out = [];
    const it = client.listEntities({ queryOptions: { filter: `PartitionKey eq '${PARTITION}' and timestamp ge '${cutoffIso}'` } });
    for await (const e of it) {
      out.push({
        id: e.rowKey,
        timestamp: e.timestamp,
        userName: e.userName || "",
        userEmail: e.userEmail || "",
        action: e.action || "",
        entityType: e.entityType || "",
        entityId: e.entityId || "",
        entityName: e.entityName || ""
      });
    }
    // Sort newest first (rowKey is already reverse-sorted, but sort by timestamp to be safe)
    out.sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
    return ok(context, out);
  } catch (e) {
    context.log.error("history error", e);
    return bad(context, "Server error: " + e.message, 500);
  }
};
