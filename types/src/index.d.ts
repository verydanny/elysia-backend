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
                200: Promise<import("@supabase/gotrue-js").User | undefined>;
            };
        };
    };
    "/api/user/signout": {
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
                type: "email" | "signup" | "invite" | "magiclink" | "recovery" | "email_change";
                token_hash: string;
            };
            headers: unknown;
            response: {
                200: Promise<void>;
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