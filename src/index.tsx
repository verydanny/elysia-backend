import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { user } from './controller/user.js'
import { html } from '@elysiajs/html'

const app = new Elysia()
  .use(cors())
  .use(html())
  .get('/', () => {
    return `<h1>Hello, World</h1>`
  })
  .use(user)
  .listen(Bun.env.PORT || 3000)

export type App = typeof app

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
