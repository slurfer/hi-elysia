import { Elysia, t } from "elysia"

export const user = new Elysia({ prefix: "/user" })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>,
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 }),
        }),
        session: t.Cookie(
            {
                token: t.Number(),
            },
            {
                secrets: "seia",
            },
        ),
        optionalSession: t.Optional(t.Ref("session")),
    })
    .put(
        "/sign-up",
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: "User already exists",
                })
            store.user[username] = await Bun.password.hash(password)

            return {
                success: true,
                message: "User created",
            }
        },
        {
            body: "signIn",
        },
    )
    .post(
        "/sign-in",
        async ({ store: { user, session }, error, body: { username, password }, cookie: { token } }) => {
            if (!user[username] || !(await Bun.password.verify(password, user[username])))
                return error(400, {
                    success: false,
                    message: "Invalid username or password",
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`,
            }
        },
        {
            body: "signIn",
            cookie: "session",
        },
    )
