import { Elysia } from 'elysia'
import { supabasePlugin } from '../supabase.js'
import { authModel } from '../model/signup.model.js'

function signup(app: typeof supabasePlugin) {
  return app.post(
    '/signup',
    async ({ body, supabase }) => {
      const { username, password } = body

      const { error } = await supabase.auth.signUp({
        email: username,
        password,
        options: {
          emailRedirectTo: `${Bun.env.ORIGIN}/api/user/confirm`,
        },
      })

      if (!error) {
        return `Sign-Up Successful`
      }
    },
    { body: authModel }
  )
}

function signin(app: typeof supabasePlugin) {
  return app.post(
    '/signin',
    async ({ body, supabase }) => {
      const { username, password } = body

      const { error } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      })

      if (!error) {
        return 'Login Successful'
      }
    },
    {
      body: authModel,
    }
  )
}

function signout(app: typeof supabasePlugin) {
  return app.post('/signout', async ({ supabase }) => {
    const { error } = await supabase.auth.signOut({ scope: 'global' })

    if (!error) {
      return 'Logout Successful'
    }
  })
}

export const user = new Elysia({ prefix: '/user' })
  .use(supabasePlugin)
  .use(signup)
  .use(signin)
  .use(signout)
