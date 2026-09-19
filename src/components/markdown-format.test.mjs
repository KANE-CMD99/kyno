import { test } from "node:test";
import assert from "node:assert";
import { applyFormat } from "./markdown-format.ts";

test("bold wraps the selection and keeps it selected", () => {
  const r = applyFormat("hello world", 0, 5, "bold");
  assert.equal(r.value, "**hello** world");
  assert.equal(r.value.slice(r.selectionStart, r.selectionEnd), "hello");
});

test("bold on an empty selection inserts a placeholder and selects it", () => {
  const r = applyFormat("abc", 3, 3, "bold");
  assert.equal(r.value, "abc**bold text**");
  assert.equal(r.value.slice(r.selectionStart, r.selectionEnd), "bold text");
});

test("italic uses a single asterisk", () => {
  assert.equal(applyFormat("hi", 0, 2, "italic").value, "*hi*");
});

test("heading prefixes the whole line the cursor sits on", () => {
  const r = applyFormat("line one\nline two", 12, 12, "h2");
  assert.equal(r.value, "line one\n## line two");
});

test("unordered list prefixes every selected line", () => {
  const r = applyFormat("a\nb", 0, 3, "ul");
  assert.equal(r.value, "- a\n- b");
});

test("ordered list numbers each selected line", () => {
  const r = applyFormat("a\nb", 0, 3, "ol");
  assert.equal(r.value, "1. a\n2. b");
});

test("quote prefixes every selected line", () => {
  assert.equal(applyFormat("a\nb", 0, 3, "quote").value, "> a\n> b");
});

test("link wraps the selection as link text", () => {
  const r = applyFormat("click here", 0, 10, "link", "https://x.test");
  assert.equal(r.value, "[click here](https://x.test)");
});

test("image inserts markdown image syntax with the uploaded url", () => {
  const r = applyFormat("abc", 3, 3, "image", "/uploads/x.png");
  assert.equal(r.value, "abc![](/uploads/x.png)");
});

test("bold on a reversed selection is handled the same as a normal one", () => {
  assert.equal(applyFormat("hello", 4, 1, "bold").value, "h**ell**o");
});
