const { ensureTables, getClient, authenticate, unauth, ok, bad } = require("../shared/table");

// Same strategy as workers: store the whole threads object as one JSON blob.
const PARTITION = "threads";
const ROW = "all";

module.exports = async function (context, req) {
  try {
    const user = await authenticate(req);
    if (!user) return unauth(context);
    await ensureTables();
    const client = getClient("threads");

    if (req.method === "GET") {
      try {
        const e = await client.getEntity(PARTITION, ROW);
        return ok(context, e.dataJson ? JSON.parse(e.dataJson) : {});
      } catch (err) {
        return ok(context, {});
      }
    }

    if (req.method === "POST") {
      const body = req.body;
      if (!body || typeof body !== "object") return bad(context, "Invalid body");
      await client.upsertEntity({
        partitionKey: PARTITION,
        rowKey: ROW,
        dataJson: JSON.stringify(body)
      }, "Replace");
      return ok(context, body);
    }

    return bad(context, "Method not allowed", 405);
  } catch (err) {
    context.log.error(err);
    return bad(context, err.message || "Server error", 500);
  }
};
