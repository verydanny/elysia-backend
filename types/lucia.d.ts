/// <reference types="bun-types" />
/// <reference types="node" />
export declare const auth: import("lucia").Auth<{
    env: "PROD" | "DEV";
    middleware: import("lucia").Middleware<[{
        request: Request;
        set: {
            headers: Record<string, string> & {
                "Set-Cookie"?: string | string[] | undefined;
            };
        };
    }]>;
    adapter: import("lucia").InitializeAdapter<Readonly<{
        getSessionAndUser?: ((sessionId: string) => Promise<[any, any] | [null, null]>) | undefined;
    } & Readonly<{
        getSession: (sessionId: string) => Promise<any>;
        getSessionsByUserId: (userId: string) => Promise<any[]>;
        setSession: (session: any) => Promise<void>;
        updateSession: (sessionId: string, partialSession: Partial<any>) => Promise<void>;
        deleteSession: (sessionId: string) => Promise<void>;
        deleteSessionsByUserId: (userId: string) => Promise<void>;
    }> & Readonly<{
        getUser: (userId: string) => Promise<any>;
        setUser: (user: any, key: import("lucia").KeySchema | null) => Promise<void>;
        updateUser: (userId: string, partialUser: Partial<any>) => Promise<void>;
        deleteUser: (userId: string) => Promise<void>;
        getKey: (keyId: string) => Promise<import("lucia").KeySchema | null>;
        getKeysByUserId: (userId: string) => Promise<import("lucia").KeySchema[]>;
        setKey: (key: import("lucia").KeySchema) => Promise<void>;
        updateKey: (keyId: string, partialKey: Partial<import("lucia").KeySchema>) => Promise<void>;
        deleteKey: (keyId: string) => Promise<void>;
        deleteKeysByUserId: (userId: string) => Promise<void>;
    }>>>;
}>;
export type Auth = typeof auth;
//# sourceMappingURL=lucia.d.ts.map