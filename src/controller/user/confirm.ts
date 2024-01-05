import { type User } from './user'

/**
 * Path: path <ORIGIN>/api/user/confirm
 */
export function confirm(app: User) {
  return app.get(
    '/confirm',
    async ({ supabase, query, set }) => {
      const { token_hash, type } = query

      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })

      if (!error) {
        set.status = 200
      }
    },
    {
      query: 'confirm',
    }
  )
}
