export async function up(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS user_key (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES auth_user(id),
      hashed_password TEXT
    )
  `
}

export async function down(sql) {
  await sql`
    DROP TABLE IF EXISTS user_key
  `
}
