import { t } from 'elysia'

export const authModel = t.Object({
  username: t.String({
    format: 'email',
  }),
  password: t.String(),
})
