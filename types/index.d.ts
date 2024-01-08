import { Elysia } from 'elysia';
declare const app: Elysia<"/api", {
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
    "/api/user/magiclink": {
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
    "/api/user/signup": {
        post: {
            body: {
                username: string;
                password: string;
            };
            params: never;
            query: unknown;
            headers: unknown;
            response: {
                200: Promise<import("@supabase/gotrue-js").User | null | undefined>;
            };
        };
    };
    "/api/user/signin": {
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
    "/api/user/signout": {
        get: {
            body: unknown;
            params: never;
            query: unknown;
            headers: unknown;
            response: {
                200: Promise<"Logout Successful" | undefined>;
            };
        };
    } & {
        post: {
            body: unknown;
            params: never;
            query: unknown;
            headers: unknown;
            response: {
                200: Promise<"Logout Successful" | undefined>;
            };
        };
    };
    "/api/user/refresh": {
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
    "/api/user/confirm": {
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
    "/api/": {
        get: {
            body: unknown;
            params: never;
            query: unknown;
            headers: unknown;
            response: {
                200: string;
            };
        };
    };
}, false>;
export type App = typeof app;
export {};
//# sourceMappingURL=index.d.ts.map