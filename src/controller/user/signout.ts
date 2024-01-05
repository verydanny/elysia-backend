import { type User } from './user'

export function signout(app: User) {
  return app.post('/signout', async ({ supabase }) => {
    const { error } = await supabase.auth.signOut({ scope: 'global' })

    if (!error) {
      return 'Logout Successful'
    }
  })
}
