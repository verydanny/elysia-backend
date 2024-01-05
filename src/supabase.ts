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
            return decodeURIComponent(cookie[key].toString())
          },
          set: (key, value, options) => {
            cookie[key].set({
              ...options,
              httpOnly: true,
            }).value = value
          },
          remove: (key, options) => {
            return cookie[key].remove(options)
          },
        },
      }
    ),
  }
})
