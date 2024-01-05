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
        confirm: {
            type: "email" | "signup" | "invite" | "magiclink" | "recovery" | "email_change";
            token_hash: string;
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
                type: "email" | "signup" | "invite" | "magiclink" | "recovery" | "email_change";
                token_hash: string;
            };
            headers: unknown;
            response: {
                200: Promise<void>;
            };
        };
    };
}, false>;
//# sourceMappingURL=confirm.d.ts.map