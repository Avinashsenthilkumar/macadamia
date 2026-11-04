/**
 * Creates (or resets the password of) an administrator account.
 *
 *   npm run admin:create
 *   npm run admin:create -- --email you@example.com --name "Your Name"
 *
 * The password is typed interactively and never stored in code, env files or shell history.
 */
import { createInterface } from "readline";
import { Writable } from "stream";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

function ask(question: string, hidden = false): Promise<string> {
  let muted = false;
  const output = new Writable({
    write(chunk, _enc, cb) {
      if (!muted) process.stdout.write(chunk);
      cb();
    },
  });
  const rl = createInterface({ input: process.stdin, output, terminal: true });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    });
    muted = hidden;
  });
}

const strong = (pw: string) => pw.length >= 10 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /\d/.test(pw);

async function main() {
  const email = (arg("email") || process.env.ADMIN_EMAIL || (await ask("Admin email: "))).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Invalid email address.");
  const name = arg("name") || (await ask("Full name: ")) || "Administrator";

  const password = await ask("Password (min 10 chars, upper + lower case + number): ", true);
  if (!strong(password)) throw new Error("Password is too weak.");
  const confirm = await ask("Confirm password: ", true);
  if (password !== confirm) throw new Error("Passwords do not match.");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.adminUser.upsert({
    where: { email },
    update: { passwordHash, isActive: true, role: "ADMIN", sessionVersion: { increment: 1 } },
    create: { email, name, passwordHash, role: "ADMIN" },
  });
  console.log(`✔ Administrator ready: ${user.email}. Sign in at /admin/login`);
}

main()
  .catch((e) => {
    console.error(`✖ ${e instanceof Error ? e.message : e}`);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
