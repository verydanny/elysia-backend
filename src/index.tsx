import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { user } from './controller/user.js'
import { html } from '@elysiajs/html'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  Bun.env.SUPABASE_URL as string,
  Bun.env.SUPABASE_API as string
)

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
