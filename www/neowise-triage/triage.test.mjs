import { test } from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { createApp } from "./server.mjs";

const server = createApp();

// Exercise the actual HTTP request listener without binding a network port.
async function post(body) {
  const request = Readable.from([Buffer.from(body)]);
  request.method = "POST";
  request.url = "/api/triage";
  return new Promise((resolve, reject) => {
    let status;
    const response = {
      writeHead(code) { status = code; },
      end(payload) {
        try { resolve({ status, body: JSON.parse(payload) }); }
        catch (error) { reject(error); }
      },
    };
    server.emit("request", request, response);
  });
}

test("invalid input returns 400, including malformed JSON and null", async () => {
  for (const body of ["{", "", "null", "[]", "{}", '{"text":null}', '{"text":12}', '{"text":true}', '{"text":[]}', '{"text":""}', '{"text":"  \\n "}']) {
    assert.deepEqual(await post(body), { status: 400, body: { status: "invalid_input" } }, body);
  }
});

test("valid requests return the allowed topics and a nonempty draft", async () => {
  for (const [text, topic] of [["Доставка", "delivery"], ["Стоимость", "pricing"], ["Здравствуйте", "other"]]) {
    const response = await post(JSON.stringify({ text }));
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      status: "ready", topic, draft: "Спасибо за обращение. Уточним детали заявки.",
    });
  }
});

test("every mock failure returns manual review with cleared fields", async () => {
  for (const marker of ["[timeout]", "[error]", "[bad-json]", "[bad-topic]", "[empty-draft]"]) {
    const start = performance.now();
    assert.deepEqual(await post(JSON.stringify({ text: marker })), {
      status: 200, body: { status: "manual_review", topic: null, draft: null },
    }, marker);
    if (marker === "[timeout]") {
      // Enough scheduling tolerance, while still catching the mock's 1200 ms wait.
      assert.ok(performance.now() - start < 1000, "provider timeout must bound waiting");
    }
  }
});

const html = await readFile(new URL("./index.html", import.meta.url), "utf8");
const script = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];

function page(fetchImpl) {
  const result = { textContent: "" };
  const message = { value: "Заявка" };
  let submit;
  runInNewContext(script, {
    document: { querySelector: selector => ({
      form: { addEventListener: (_, callback) => { submit = callback; } },
      "#result": result, "#message": message,
    })[selector] },
    fetch: fetchImpl, AbortController, setTimeout, clearTimeout,
  });
  return { result, message, submit: () => submit({ preventDefault() {} }) };
}
const ready = draft => ({ ok: true, status: 200, json: async () => ({ status: "ready", topic: "delivery", draft }) });

test("page clears successful draft on every failure and permits recovery", async () => {
  for (const fail of [
    async () => ({ ok: true, status: 200, json: async () => ({ status: "manual_review", topic: null, draft: null }) }),
    async () => { throw new Error("Network down"); },
    async () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError(); } }),
    async () => ({ ok: false, status: 500, json: async () => ({}) }),
    async () => ready("  "),
  ]) {
    let failNext = false;
    const ui = page((...args) => failNext ? fail(...args) : Promise.resolve(ready("PREVIOUS DRAFT")));
    await ui.submit();
    assert.match(ui.result.textContent, /PREVIOUS DRAFT/);
    failNext = true;
    const pending = ui.submit();
    assert.doesNotMatch(ui.result.textContent, /PREVIOUS DRAFT/);
    await pending;
    assert.match(ui.result.textContent, /вручную/);
    assert.doesNotMatch(ui.result.textContent, /PREVIOUS DRAFT/);
    failNext = false;
    await ui.submit();
    assert.match(ui.result.textContent, /PREVIOUS DRAFT/);
  }
});

test("blank submission clears draft and does not call API", async () => {
  let calls = 0;
  const ui = page(async () => { calls++; return ready("OLD"); });
  await ui.submit();
  ui.message.value = "   ";
  await ui.submit();
  assert.equal(calls, 1);
  assert.match(ui.result.textContent, /Введите текст/);
  assert.doesNotMatch(ui.result.textContent, /OLD/);
});

test("out-of-order responses keep the latest draft even if abort is ignored", async () => {
  const requests = [];
  const ui = page(() => new Promise(resolve => requests.push(resolve)));
  const first = ui.submit();
  const second = ui.submit();
  requests[1](ready("NEW"));
  await second;
  requests[0](ready("OLD"));
  await first;
  assert.match(ui.result.textContent, /NEW/);
  assert.doesNotMatch(ui.result.textContent, /OLD/);
});
