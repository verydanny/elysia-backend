import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  Bun.env.SUPABASE_URL as string,
  Bun.env.SUPABASE_API as string
)
