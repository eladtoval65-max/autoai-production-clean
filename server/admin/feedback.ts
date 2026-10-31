/** Visitor feedback ("מה חסר לך?") for the admin: newest first, and delete. */
import { fail, int, rows, type Action } from "./http";

export const listFeedback: Action = async ({ pool }) => ({
  items: rows(await pool.query("SELECT id, message, page, email, createdAt FROM feedback ORDER BY id DESC LIMIT 200")),
});

export const deleteFeedback: Action = async ({ pool, body }) => {
  const id = int(body.id); if (!id) fail("bad_request");
  await pool.query("DELETE FROM feedback WHERE id = ?", [id]);
  return { ok: true };
};
