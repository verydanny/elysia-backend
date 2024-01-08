import { type User } from './user'

export function signin(app: User) {
  return app.post(
    '/signin',
    async ({ body, supabase, set }) => {
      const { username, password } = body

      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      })

      if (!error) {
        return {
          error,
          data,
        }
      }

      set.status = 'Bad Request'

      return {
        error,
      }
    },
    {
      body: 'sign',
      type: 'application/json',
    }
  )
}
