import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import pg from "pg";

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const text = fs.readFileSync(filePath, "utf8");
  const out = {};

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }

  return out;
}

function splitSqlStatements(sql) {
  // Good enough for this repo schema (no custom dollar-quoted functions).
  return sql
    .split(/;\s*\n/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  const appRoot = path.resolve(process.cwd());
  const envLocal = path.join(appRoot, ".env.local");
  const env = { ...readEnvFile(envLocal), ...process.env };

  const dbUrl = env.SUPABASE_DB_URL || env.DATABASE_URL;
  if (!dbUrl) {
    console.error(`Missing SUPABASE_DB_URL (or DATABASE_URL). Add it to ${envLocal}`);
    process.exit(1);
  }

  const schemaPath = path.resolve(appRoot, "..", "..", "supabase", "schema.sql");
  if (!fs.existsSync(schemaPath)) {
    console.error(`Schema file not found: ${schemaPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, "utf8");
  const statements = splitSqlStatements(sql);

  const { Client } = pg;
  const client = new Client({ connectionString: dbUrl });
  await client.connect();

  try {
    await client.query("begin");
    for (const stmt of statements) {
      await client.query(stmt);
    }
    await client.query("commit");
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    await client.end();
  }

  console.log(`Applied schema: ${schemaPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

