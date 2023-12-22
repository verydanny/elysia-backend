import { Elysia } from 'elysia'
import { authModel } from '../model/signup.model.js'

function signup(app: Elysia<'/user'>) {
  return app
    .get('/sign-up', ({ set }) => {
      set.headers['contentType'] = 'text/html'

      return `<h1>Sign Up Page</h1>`
    })
    .post(
      '/sign-up',
      ({ body }) => {
        const { username, password } = body

        return `username: ${username} password: ${password}`
      },
      { body: authModel }
    )
}

function signin(app: Elysia<'/user'>) {
  return app
    .get('/sign-in', ({ set }) => {
      set.headers['contentType'] = 'text/html'

      return `<h1>Sign In Page</h1>`
    })
    .post('/sign-in', () => 'Sign In', {
      body: authModel,
    })
}

export const user = new Elysia({ prefix: '/user' }).use(signup).use(signin)
