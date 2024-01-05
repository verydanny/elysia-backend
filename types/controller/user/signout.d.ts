import { type User } from './user';
export declare function signout(app: User): import("elysia").default<"/user", {
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
}, false>;
//# sourceMappingURL=signout.d.ts.map