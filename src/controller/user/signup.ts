import { type User } from './user'

export function signup(app: User) {
  return app.post(
    '/signup',
    async ({ body, supabase }) => {
      const { username, password } = body

      const { data, error } = await supabase.auth.signUp({
        email: username,
        password,
        options: {
          emailRedirectTo: `${Bun.env.ORIGIN}/api/user/confirm`,
        },
      })

      if (!error) {
        return data.user
      }
    },
    { body: 'sign' }
  )
}
