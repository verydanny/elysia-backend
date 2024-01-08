import { Elysia } from 'elysia'
import { supabasePlugin } from '../../supabase'
import { authModel } from '../../model/signup.model'

import { signup } from './signup'
import { signin } from './signin'
import { signout } from './signout'
import { confirm } from './confirm'
import { refresh } from './refresh'
import { magiclink } from './magiclink'

export const userRoute = new Elysia({ prefix: '/user' })
  .use(supabasePlugin)
  .use(authModel)

export const user = userRoute
  .use(magiclink)
  .use(signup)
  .use(signin)
  .use(signout)
  .use(refresh)
  .use(confirm)

export type User = typeof userRoute
