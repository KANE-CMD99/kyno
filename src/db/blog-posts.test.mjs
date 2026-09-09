import { test } from "node:test";
import assert from "node:assert";
import { slugify } from "./slug.mjs";

test("slugify lowercases and replaces spaces with dashes", () => {
  assert.equal(slugify("Hello World Post"), "hello-world-post");
});

test("slugify strips punctuation and non-ascii", () => {
  assert.equal(slugify("How-To: Build a Résumé!"), "how-to-build-a-rsum");
});

test("slugify collapses multiple spaces and trims", () => {
  assert.equal(slugify("  My   Great  Post  "), "my-great-post");
});
