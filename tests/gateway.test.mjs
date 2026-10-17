import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../"+path, import.meta.url), "utf8");
const index = read("index.html");
const go = read("go.html");
const mirrors = ["sex123.vercel.app","sex123.pages.dev","sexnav.github.io","sex123.netlify.app"];
test("Gateway uses adapted upstream layout and exposes a single GO action", () => {
  assert.match(index, /class="w"/);
  assert.match(index, /class="mail"/);
  assert.match(index, /href="\/go.html"/);
  for (const host of mirrors) assert.ok(index.includes(host), host);
});
test("No upstream brands, email or business destinations leak into runtime pages", () => {
  for (const page of [index, go]) {
    assert.doesNotMatch(page, /aidizhi|aiboaibo|455555|爱播爱播|ntrsp\.com|439000\.xyz/i);
  }
});
test("GO JavaScript syntax and fallback policy", () => {
  const inline = go.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(inline);
  assert.doesNotThrow(() => new Function(inline[1]));
  assert.match(inline[1], /Promise\.all\(lines\.map/);
  assert.match(inline[1], /未能确认可用镜像/);
  assert.match(inline[1], /if\(isApp\)\{guide\(m\);return\}/);
  assert.match(inline[1], /assets\/favicon\.svg/);
  assert.doesNotMatch(inline[1], /go\(orderedPool\[0\]/);
});
test("GO mirror pool decodes to the four Navigation mirrors", () => {
  const pool = go.match(/var pd=(\[\[[\s\S]*?\]\]),pool=\[\]/);
  assert.ok(pool);
  const encoded = JSON.parse(pool[1]);
  const decoded = encoded.map(bytes => bytes.map((n,i)=>String.fromCharCode(n ^ ((73+i*17)&255))).join(""));
  assert.deepEqual(decoded, mirrors.map(host=>"https://"+host+"/"));
});
