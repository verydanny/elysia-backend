import { type User } from './user'

export function signin(app: User) {
  return app.post(
    '/signin',
    async ({ body, supabase }) => {
      const { username, password } = body

      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      })

      if (!error) {
        return data.user
      }
    },
    {
      body: 'sign',
    }
  )
}
