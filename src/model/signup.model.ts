import { Elysia, t } from 'elysia'

const email = t.String({
  format: 'email',
  default: undefined,
  examples: ['user@email.com', 'user@gmail.com'],
})

export const authModel = new Elysia().model({
  sign: t.Object({
    username: email,
    password: t.String({
      minLength: 6,
      maxLength: 72,
    }),
  }),
  magiclink: t.Object({
    email,
  }),
  confirm: t.Object({
    type: t.Union([
      t.Literal('signup'),
      t.Literal('invite'),
      t.Literal('magiclink'),
      t.Literal('recovery'),
      t.Literal('email_change'),
      t.Literal('email'),
    ]),
    token_hash: t.Optional(t.String()),
    token: t.Optional(t.String()),
    email: t.Optional(t.String({ format: 'email' })),
  }),
})
