import User from "./components/user";

if (!Bun.argv[2] || !Bun.argv[3]) {
    console.error(`No username or password provided. Usage: 'bun run add-user.ts "username" "password"'`)
}

const db = new User();

const argonHash = await Bun.password.hash(Bun.argv[3]);

await db.userCreate(Bun.argv[2], argonHash)

console.log("Done")

process.exit(0);