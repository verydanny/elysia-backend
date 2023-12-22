export async function up(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS user_session (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES auth_user(id),
      active_expires BIGINT NOT NULL,
      idle_expires BIGINT NOT NULL
    )
  `
}

export async function down(sql) {
  await sql`
    DROP TABLE IF EXISTS user_session
  `
}
