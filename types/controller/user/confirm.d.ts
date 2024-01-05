import { type User } from './user';
/**
 * Path: path <ORIGIN>/api/user/confirm
 */
export declare function confirm(app: User): import("elysia").default<"/user", {
    request: {};
    store: {};
    derive: {
        supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
    };
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
}, {
    body: unknown;
    headers: unknown;
    query: unknown;
    params: unknown;
    cookie: unknown;
    response: unknown;
}, {}, {
    "/user/confirm": {
        get: {
            body: unknown;
            params: never;
            query: {
                email?: string | undefined;
                token_hash?: string | undefined;
                token?: string | undefined;
                type: "email" | "magiclink" | "signup" | "invite" | "recovery" | "email_change";
            };
            headers: unknown;
            response: {
                200: Promise<import("@supabase/gotrue-js").AuthError | {
                    status: string;
                } | undefined>;
            };
        };
    };
}, false>;
//# sourceMappingURL=confirm.d.ts.map