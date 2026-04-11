const { ensureTables, getClient, authenticate, unauth, ok, bad } = require("../shared/table");

const PARTITION = "leave";

function toEntity(l) {
  return {
    partitionKey: PARTITION,
    rowKey: String(l.id),
    crew: l.crew || "",
    workerName: l.workerName || "",
    startDate: l.startDate || "",
    endDate: l.endDate || "",
    reason: l.reason || ""
  };
}
function fromEntity(e) {
  return {
    id: parseInt(e.rowKey, 10),
    crew: e.crew,
    workerName: e.workerName,
    startDate: e.startDate,
    endDate: e.endDate,
    reason: e.reason
  };
}

module.exports = async function (context, req) {
  try {
    const user = await authenticate(req);
    if (!user) return unauth(context);
    await ensureTables();
    const client = getClient("leave");
    const id = context.bindingData.id;

    if (req.method === "GET") {
      const out = [];
      const it = client.listEntities({ queryOptions: { filter: `PartitionKey eq '${PARTITION}'` } });
      for await (const e of it) out.push(fromEntity(e));
      return ok(context, out);
    }

    if (req.method === "POST") {
      const body = req.body || {};
      if (Array.isArray(body)) {
        for (const l of body) await client.upsertEntity(toEntity(l), "Replace");
        return ok(context, { migrated: body.length });
      }
      if (!body.id && body.id !== 0) return bad(context, "id required");
      await client.upsertEntity(toEntity(body), "Replace");
      return ok(context, body);
    }

    if (req.method === "DELETE") {
      if (!id) return bad(context, "id required");
      try { await client.deleteEntity(PARTITION, String(id)); } catch (e) {}
      return ok(context, { deleted: id });
    }

    return bad(context, "Method not allowed", 405);
  } catch (err) {
    context.log.error(err);
    return bad(context, err.message || "Server error", 500);
  }
};
