import { type User } from './user'

/**
 * Path: path <ORIGIN>/api/user/confirm
 */
export function confirm(app: User) {
  return app.get(
    '/confirm',
    async ({ supabase, query, set }) => {
      const { token_hash, type, email } = query

      if (token_hash) {
        const { error } = await supabase.auth.verifyOtp({
          type,
          token_hash,
        })

        if (!error) {
          set.status = 200

          if (email) {
            set.redirect = '/api'

            return {
              status: 'authenticated',
            }
          }

          return {
            status: 'authenticated',
          }
        }

        return error
      }
    },
    {
      query: 'confirm',
      type: 'application/json',
    }
  )
}
