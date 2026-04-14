const { ensureTables, getClient, authenticate, unauth, requireAdmin, ok, bad } = require("../shared/table");

const PARTITION = "job";

// Jobs are stored as one entity per job. Complex fields (workers, photos) are JSON strings.
function toEntity(job) {
  return {
    partitionKey: PARTITION,
    rowKey: String(job.id),
    crew: job.crew || "",
    location: job.location || "",
    startDate: job.startDate || "",
    endDate: job.endDate || "",
    daysJson: JSON.stringify(job.days || []),
    attendanceJson: JSON.stringify(job.attendance || {}),
    workersJson: JSON.stringify(job.workers || []),
    notes: job.notes || "",
    invoiced: !!job.invoiced,
    poFileName: job.poFileName || "",
    photosJson: JSON.stringify(job.photos || []),
    documentLinksJson: JSON.stringify(job.documentLinks || (job.documentLink ? [{name:job.documentName||"",url:job.documentLink}] : [])),
    createdBy: job.createdBy || "",
    createdAt: job.createdAt || "",
    lastEditedBy: job.lastEditedBy || "",
    lastEditedAt: job.lastEditedAt || ""
  };
}

function fromEntity(e) {
  let docLinks = [];
  if (e.documentLinksJson) {
    try { docLinks = JSON.parse(e.documentLinksJson); } catch(err) { docLinks = []; }
  } else if (e.documentLink) {
    docLinks = [{ name: e.documentName||"", url: e.documentLink }];
  }
  let days = [];
  if (e.daysJson) {
    try { days = JSON.parse(e.daysJson); } catch(err) { days = []; }
  }
  let attendance = {};
  if (e.attendanceJson) {
    try { attendance = JSON.parse(e.attendanceJson); } catch(err) { attendance = {}; }
  }
  return {
    id: parseInt(e.rowKey, 10),
    crew: e.crew,
    location: e.location,
    startDate: e.startDate,
    endDate: e.endDate,
    days,
    attendance,
    workers: e.workersJson ? JSON.parse(e.workersJson) : [],
    notes: e.notes,
    invoiced: !!e.invoiced,
    poFile: null,
    poFileName: e.poFileName || "",
    photos: e.photosJson ? JSON.parse(e.photosJson) : [],
    documentLinks: docLinks,
    createdBy: e.createdBy || "",
    createdAt: e.createdAt || "",
    lastEditedBy: e.lastEditedBy || "",
    lastEditedAt: e.lastEditedAt || ""
  };
}

module.exports = async function (context, req) {
  try {
    const user = await authenticate(req);
    if (!user) return unauth(context);
    await ensureTables();
    const client = getClient("jobs");
    const id = context.bindingData.id;

    if (req.method === "GET") {
      const out = [];
      const it = client.listEntities({ queryOptions: { filter: `PartitionKey eq '${PARTITION}'` } });
      for await (const e of it) out.push(fromEntity(e));
      return ok(context, out);
    }

    if (req.method === "POST") {
      const body = req.body || {};
      // Bulk migration: array of jobs
      if (Array.isArray(body)) {
        for (const j of body) {
          await client.upsertEntity(toEntity(j), "Replace");
        }
        return ok(context, { migrated: body.length });
      }
      // Single job upsert
      if (!body.id && body.id !== 0) return bad(context, "id required");
      await client.upsertEntity(toEntity(body), "Replace");
      return ok(context, fromEntity(toEntity(body)));
    }

    if (req.method === "DELETE") {
      if (!requireAdmin(user)) return bad(context, "Admin only", 403);
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
