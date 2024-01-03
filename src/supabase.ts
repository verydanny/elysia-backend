import { Elysia } from 'elysia'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  Bun.env.SUPABASE_URL as string,
  Bun.env.SUPABASE_API as string
)

export const supabasePlugin = new Elysia().derive(({ cookie }) => {
  return {
    supabase: createServerClient(
      Bun.env.SUPABASE_URL as string,
      Bun.env.SUPABASE_API as string,
      {
        cookies: {
          get: (key) => {
            console.log(`Cookie Get('${key}')`, cookie[key].get())

            return cookie[key].get()
          },
          set: (key, value, options) => {
            console.log(`Cookie Set('${key}'): '${value}'`, cookie[key])

            cookie[key].set(options).value = value
          },
          remove: (key, options) => {
            console.log(`Cookie Remove('${key}')`, cookie[key])

            return cookie[key].remove(options)
          },
        },
      }
    ),
  }
})
