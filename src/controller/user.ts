import { Elysia } from 'elysia'
import { supabase } from '../supabase.js'
import { authModel } from '../model/signup.model.js'

function signup(app: Elysia<'/user'>) {
  return app.post(
    '/sign-up',
    async ({ body }) => {
      const { username, password } = body

      const { data, error } = await supabase.auth.signUp({
        email: username,
        password,
        options: {
          emailRedirectTo: 'http://localhost:3000/api/user/confirm',
        },
      })

      return {
        data,
        error,
      }
    },
    { body: authModel }
  )
}

function signin(app: Elysia<'/user'>) {
  return app.post('/sign-in', () => 'Sign In', {
    body: authModel,
  })
}

function confirm(app: Elysia<'/user'>) {
  return app.get('/confirm', ({ set }) => {
    set.headers['Content-Type'] = 'text/html'

    return `<h1>Congrats you're registered</h1>`
  })
}

export const user = new Elysia({ prefix: '/user' })
  .use(signup)
  .use(signin)
  .use(confirm)
