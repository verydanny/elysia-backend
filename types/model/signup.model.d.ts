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
        magiclink: {
            email: string;
        };
        confirm: {
            email?: string | undefined;
            token_hash?: string | undefined;
            token?: string | undefined;
            type: "email" | "magiclink" | "signup" | "invite" | "recovery" | "email_change";
        };
    };
    error: {};
}, {}, {}, {}, false>;
//# sourceMappingURL=signup.model.d.ts.map