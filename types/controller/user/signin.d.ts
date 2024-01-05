import { type User } from './user';
export declare function signin(app: User): import("elysia").default<"/user", {
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
    "/user/signin": {
        post: {
            body: {
                username: string;
                password: string;
            };
            params: never;
            query: unknown;
            headers: unknown;
            response: {
                200: Promise<{
                    error: null;
                    data: {
                        user: import("@supabase/gotrue-js").User;
                        session: import("@supabase/gotrue-js").Session;
                        weakPassword?: import("@supabase/gotrue-js").WeakPassword | undefined;
                    };
                } | {
                    error: import("@supabase/gotrue-js").AuthError;
                    data?: undefined;
                }>;
            };
        };
    };
}, false>;
//# sourceMappingURL=signin.d.ts.map