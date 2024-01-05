import { Elysia } from 'elysia';
export declare const authModel: Elysia<"", {
    request: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    type: {
        sign: {
            username: string;
            password: string;
        };
        confirm: {
            type: "email" | "signup" | "invite" | "magiclink" | "recovery" | "email_change";
            token_hash: string;
        };
    };
    error: {};
}, {}, {}, {}, false>;
//# sourceMappingURL=signup.model.d.ts.map