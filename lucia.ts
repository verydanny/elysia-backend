import { lucia } from 'lucia'
import { elysia } from 'lucia/middleware'
import { postgres } from '@lucia-auth/adapter-postgresql'
import { sql } from './src/model/connect.js'

export const auth = lucia({
  env: process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  middleware: elysia(),
  adapter: postgres(sql, {
    user: 'auth_user',
    key: 'user_key',
    session: 'user_session',
  }),
})

export type Auth = typeof auth
