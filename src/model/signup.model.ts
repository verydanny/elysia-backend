import { Elysia, t } from 'elysia'

export const authModel = new Elysia().model({
  sign: t.Object({
    username: t.String({
      format: 'email',
      default: undefined,
      examples: ['user@email.com', 'user@gmail.com'],
    }),
    password: t.String({
      minLength: 6,
      maxLength: 72,
    }),
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
    token_hash: t.String(),
  }),
})
