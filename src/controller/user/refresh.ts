import { type User } from './user'

export function refresh(app: User) {
  return app.get('/refresh', async ({ supabase }) => {
    const { data, error } = await supabase.auth.refreshSession()

    if (!error) {
      return data.user
    }
  })
}
