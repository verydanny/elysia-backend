import { type User } from './user';
export declare function magiclink(app: User): Promise<import("elysia").default<"/user", {
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
    "/user/magiclink": {
        post: {
            body: {
                email: string;
            };
            params: never;
            query: unknown;
            headers: unknown;
            response: {
                200: Promise<import("@supabase/gotrue-js").AuthError | {
                    status: string;
                }>;
            };
        };
    };
}, false>>;
//# sourceMappingURL=magiclink.d.ts.map