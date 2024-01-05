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
}, {}, import("elysia/types").AddPrefix<"/api", {}> & import("elysia/types").AddPrefix<"/api", import("elysia/types").AddPrefix<"/user", {}> & {
    "/user/signup": {
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
} & {
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
                200: Promise<import("@supabase/gotrue-js").User | undefined>;
            };
        };
    };
} & {
    "/user/signout": {
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
} & {
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
} & {
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
}>, false>;
export type App = typeof app;
export {};
//# sourceMappingURL=index.d.ts.map