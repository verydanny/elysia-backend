import { type User } from './user';
export declare function refresh(app: User): import("elysia").default<"/user", {
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
    "/user/refresh": {
        get: {
            body: unknown;
            params: never;
            query: unknown;
            headers: unknown;
            response: {
                200: Promise<import("@supabase/gotrue-js").User | null | undefined>;
            };
        };
    };
}, false>;
//# sourceMappingURL=refresh.d.ts.map