import mysql from "mysql2/promise";

/**
 * One place that turns DATABASE_URL into a mysql2 pool. TiDB Cloud (and most hosted MySQL)
 * requires TLS; connection strings copied from dashboards don't always say so, so TLS is
 * enabled automatically for known hosted providers. Never log the URL.
 */
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (pool) return pool;
  let needsTls = false;
  try {
    const host = new URL(url).hostname;
    needsTls = /tidbcloud\.com$|planetscale|psdb\.cloud$|aivencloud\.com$|rds\.amazonaws\.com$/.test(host) && !/[?&]ssl=/.test(url);
  } catch {
    return null;
  }
  pool = mysql.createPool({
    uri: url,
    connectionLimit: 3,
    waitForConnections: true,
    ...(needsTls ? { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true } } : {}),
  });
  return pool;
}
