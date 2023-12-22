export async function up(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS auth_user (
      id TEXT PRIMARY KEY
    )
  `
}

export async function down(sql) {
  await sql`
    DROP TABLE IF EXISTS auth_user
  `
}
