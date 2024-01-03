import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { user } from './controller/user.js'
import { html } from '@elysiajs/html'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://toojhcjwevocybrjnsag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvb2poY2p3ZXZvY3licmpuc2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMwODcxOTgsImV4cCI6MjAxODY2MzE5OH0.5OUhLYCJgi3PSwvQwZCP6aIjGZgrCJeiPIv7SYTsLFo'
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
