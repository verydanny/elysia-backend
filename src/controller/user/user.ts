import { Elysia } from 'elysia'
import { supabasePlugin } from '../../supabase'
import { authModel } from '../../model/signup.model'

import { signup } from './signup'
import { signin } from './signin'
import { signout } from './signout'
import { confirm } from './confirm'
import { refresh } from './refresh'

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
