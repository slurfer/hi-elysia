import { Elysia } from "elysia"
import { swagger } from "@elysiajs/swagger"

class Note {
    constructor(public data: string[] = ["Moonhalo"]) {}
}

const app = new Elysia()
    .use(swagger())
    .decorate("note", new Note())
    .get("/note", ({ note }) => note.data)
    .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
