import { beforeEach, describe, expect, mock, test } from "bun:test";

let email: string | undefined;
let allowed = false;
mock.module("server-only", () => ({}));
mock.module("@/auth", () => ({ auth: async () => email ? { user: { email } } : null }));
mock.module("@/lib/prisma", () => ({ default: { admin: { findUnique: async () => allowed ? { email } : null } } }));
const { requireAdmin } = await import("./require-admin");

beforeEach(() => { email = undefined; allowed = false; });
describe("administrative server operation authorization", () => {
  test("rejects anonymous requests", async () => {
    await expect(requireAdmin()).rejects.toThrow("Unauthorized");
  });
  test("rejects a signed-in user removed from the admin list", async () => {
    email = "revoked@example.test";
    await expect(requireAdmin()).rejects.toThrow("Unauthorized");
  });
  test("allows a currently authorized admin", async () => {
    email = "admin@example.test"; allowed = true;
    await expect(requireAdmin()).resolves.toBeUndefined();
  });
});
