import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const index = read("public/index.html");
const go = read("public/go.html");
const mirrors = ["sex123.vercel.app", "sex123.pages.dev", "sexnav.github.io", "sex123.netlify.app"];

test("Gateway uses real Tabler cards/buttons and a single smart GO action", () => {
  assert.match(index, /class="card card-lg/);
  assert.match(index, /btn btn-primary btn-lg/);
  assert.match(index, /href="\/go.html"/);
  for (const host of mirrors) assert.ok(index.includes(host), host);
});

test("runtime UI contains no handwritten CSS, retains local Tabler", () => {
  for (const page of [index, go]) {
    assert.match(page, /assets\/vendor\/tabler\.min\.css/);
    assert.match(page, /data-bs-theme="dark"/);
    assert.doesNotMatch(page, /<style\b/i);
    assert.doesNotMatch(page, /style="[^"]+"/i);
    assert.doesNotMatch(page, /aidizhi|aiboaibo|455555|爱播爱播|ntrsp\.com|439000\.xyz/i);
  }
  assert.ok(existsSync(new URL("../public/assets/vendor/tabler.min.css", import.meta.url)));
  const css = read("public/assets/vendor/tabler.min.css");
  assert.ok(css.length > 40000);
  assert.match(css, /--tblr-/);
  assert.ok(existsSync(new URL("../public/assets/vendor/TABLER-LICENSE.txt", import.meta.url)));
});

test("GO reuses original mirror probing with manual fallback", () => {
  const inline = go.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(inline);
  assert.doesNotThrow(() => new Function(inline[1]));
  assert.match(inline[1], /Promise\.all\(lines\.map/);
  assert.match(inline[1], /未能确认可用镜像/);
  assert.match(inline[1], /if\(isApp\)\{guide\(m\);return\}/);
  assert.match(inline[1], /assets\/favicon\.svg/);
  assert.match(inline[1], /classList\.remove\('d-none'\)/);
  assert.doesNotMatch(inline[1], /go\(orderedPool\[0\]/);
});

test("GO encoded mirror pool matches the four live Navigation mirrors", () => {
  const pool = go.match(/var pd=(\[\[[\s\S]*?\]\]),pool=\[\]/);
  assert.ok(pool);
  const encoded = JSON.parse(pool[1]);
  const decoded = encoded.map(bytes => bytes.map((n, i) => String.fromCharCode(n ^ ((73 + i*17)&255))).join(""));
  assert.deepEqual(decoded, mirrors.map(host => "https://" + host + "/"));
});
