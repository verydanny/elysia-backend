import { Elysia } from 'elysia';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export declare const supabasePlugin: Elysia<"", {
    request: {};
    store: {};
    derive: {
        supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
    };
    resolve: {};
}, {
    type: {};
    error: {};
}, {}, {}, {}, false>;
//# sourceMappingURL=supabase.d.ts.map