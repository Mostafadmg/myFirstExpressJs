import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { app } from "../index.js";
import { pool } from "../db.js";

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await pool.end();
});

test("health endpoint confirms PostgreSQL connectivity", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok", database: "ok" });
});

test("listings endpoint returns paginated listing data", async () => {
  const response = await fetch(`${baseUrl}/api/listings?page=1&limit=3`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok(Array.isArray(body.listings));
  assert.equal(body.listings.length <= 3, true);
  assert.ok(Number.isInteger(body.total));
});

test("global search returns listing and user result groups", async () => {
  const response = await fetch(`${baseUrl}/api/search?q=lamp`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok(Array.isArray(body.listings));
  assert.ok(Array.isArray(body.users));
});

test("global search rejects a blank query with a JSON validation error", async () => {
  const response = await fetch(`${baseUrl}/api/search?q=%20%20`);
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.message, "Invalid search query.");
  assert.ok(Array.isArray(body.errors));
});

test("malformed listing IDs return 400 before reaching PostgreSQL", async () => {
  const response = await fetch(`${baseUrl}/api/listings/not-a-number`);
  assert.equal(response.status, 400);
  assert.equal((await response.json()).message, "ID must contain only digits.");
});

test("unknown API routes return a JSON 404", async () => {
  const response = await fetch(`${baseUrl}/api/does-not-exist`);
  assert.equal(response.status, 404);
  assert.equal((await response.json()).message, "Route GET /api/does-not-exist not found.");
});
