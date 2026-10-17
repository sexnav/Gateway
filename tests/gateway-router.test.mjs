import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const html = readFileSync(new URL("../public/go.html", import.meta.url), "utf8");
const code = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(code, "GO inline script exists");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function boot({ fail = false, ua = "Mozilla/5.0 Chrome/130.0 Safari/537.36" } = {}) {
  const nodes = new Map();
  const makeNode = () => ({
    style: {}, textContent: "", href: "", children: [],
    querySelector() { return makeNode(); },
    appendChild(child) { this.children.push(child); return child; },
    remove() {}, select() {}
  });
  const document = {
    body: { innerHTML: "" },
    title: "SEX123",
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, makeNode());
      return nodes.get(id);
    },
    createElement: makeNode
  };
  let redirect = null;
  const history = { replaceState() {} };
  const store = new Map();
  const context = {
    document, history, URL, Date, Math, Uint32Array,
    window: {},
    navigator: { userAgent: ua, languages: ["zh-CN"] },
    location: {
      hash: "", origin: "https://sex123.top",
      replace(value) { redirect = value; }
    },
    performance: { now: () => Date.now() },
    localStorage: {
      getItem(key) { return store.get(key) ?? null; },
      setItem(key, value) { store.set(key, value); }
    },
    setTimeout, clearTimeout,
    Image: class {
      set src(url) {
        const delay = url.includes("sex123.pages.dev") ? 12 : url.includes("sex123.vercel.app") ? 36 : 55;
        setTimeout(() => fail ? this.onerror?.() : this.onload?.(), delay);
      }
    }
  };
  vm.runInNewContext(code, context);
  return { nodes, getRedirect: () => redirect };
}
test("GO picks the fastest successfully probed mirror", async () => {
  const run = boot();
  await sleep(300);
  assert.equal(run.getRedirect(), "https://sex123.pages.dev/");
});
test("GO never redirects to an unverified mirror when all probes fail", async () => {
  const run = boot({ fail: true });
  await sleep(300);
  assert.equal(run.getRedirect(), null);
  assert.equal(run.nodes.get("l").children.length, 4);
});
test("GO shows system browser instructions inside WeChat instead of redirecting", async () => {
  const run = boot({ ua: "Mozilla/5.0 MicroMessenger/8.0.0" });
  await sleep(60);
  assert.equal(run.getRedirect(), null);
  assert.equal(run.nodes.get("g").style.display, "block");
});
