import { Elysia } from 'elysia'
import { supabasePlugin } from '../supabase'
import { authModel } from '../model/signup.model'

function signup(app: User) {
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

function signin(app: User) {
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

function signout(app: User) {
  return app.post('/signout', async ({ supabase }) => {
    const { error } = await supabase.auth.signOut({ scope: 'global' })

    if (!error) {
      return 'Logout Successful'
    }
  })
}

function refresh(app: User) {
  return app.get('/refresh', async ({ supabase }) => {
    const { data, error } = await supabase.auth.refreshSession()

    if (!error) {
      return data.user
    }
  })
}

/**
 * Path: path <ORIGIN>/api/user/confirm
 */
function confirm(app: User) {
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

export const userRoute = new Elysia({ prefix: '/user' })
  .use(authModel)
  .use(supabasePlugin)

export const user = userRoute
  .use(signup)
  .use(signin)
  .use(signout)
  .use(refresh)
  .use(confirm)

export type User = typeof userRoute
