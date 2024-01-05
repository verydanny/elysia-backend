import { type User } from './user'

export async function magiclink(app: User) {
  return app.post(
    '/magiclink',
    async ({ supabase, body, set }) => {
      const { email } = body

      const { error } = await supabase.auth.signInWithOtp({
        email,
      })

      if (error) {
        set.status = 'Bad Request'

        return error
      }

      return { status: 'authenticated' }
    },
    {
      body: 'magiclink',
    }
  )
}
