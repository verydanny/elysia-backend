/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('./lucia.ts').Auth
  type DatabaseUserAttributes = unknown
  type DatabaseSessionAttributes = unknown
}
