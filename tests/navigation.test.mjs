import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { after, afterEach, beforeEach, test } from "node:test";
import { Window } from "happy-dom";
import ts from "typescript";

// In-memory DOM tests only: no live page, browser engine, network or layout QA.
const window = new Window({
  url: "http://localhost/",
  settings: {
    navigation: {
      disableMainFrameNavigation: true,
      disableChildFrameNavigation: true,
      disableChildPageNavigation: true,
      disableFallbackToSetURL: true,
    },
  },
});
// Native navigation belongs to browser QA; keep anchor default actions inert here.
window.open = () => null;
Object.assign(globalThis, {
  window,
  document: window.document,
  Element: window.Element,
  HTMLElement: window.HTMLElement,
  IS_REACT_ACT_ENVIRONMENT: true,
});
const { act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { createElement } = await import("react");

function loadComponent(relativePath) {
  const source = new URL(relativePath, import.meta.url);
  const require = createRequire(source);
  const output = ts.transpileModule(fs.readFileSync(source, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  const scopedRequire = (name) => name.endsWith(".module.css") ? { navigation: "navigation", current: "current" } : require(name);
  new Function("require", "module", "exports", output)(scopedRequire, module, module.exports);
  return module.exports;
}

const { AnchorFocus } = loadComponent("../src/components/navigation/anchor-focus.tsx");
const { HeaderNavigation } = loadComponent("../src/components/header/header-navigation.tsx");
let root;
let frameId = 0;
const frames = new Map();
window.requestAnimationFrame = (callback) => { frames.set(++frameId, callback); return frameId; };
window.cancelAnimationFrame = (id) => frames.delete(id);

function flushFrames() {
  const pending = [...frames.values()];
  frames.clear();
  for (const callback of pending) callback(0);
}

function setHash(hash) {
  window.history.replaceState(null, "", `/${hash}`);
}

async function mount(component) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  await act(() => root.render(createElement(component)));
}

async function changeHash(hash) {
  setHash(hash);
  await act(() => window.dispatchEvent(new window.HashChangeEvent("hashchange")));
}

beforeEach(() => {
  frames.clear();
  setHash("");
  document.body.innerHTML = `
    <div id="home"><h1>홈</h1><main id="main-content">
      <section id="features"><h2>기능</h2></section>
      <section id="guide"><h2>안내</h2></section>
      <section id="process"><h2>과정</h2></section>
      <section id="contact"><h2>문의</h2></section>
    </main></div>
    <button id="other">다른 동작</button>
    <a id="link" href="#guide"><span>안내로 이동</span></a>`;
});

afterEach(async () => {
  if (root) await act(() => root.unmount());
  root = undefined;
  frames.clear();
});
after(async () => { await window.happyDOM.abort(); window.close(); });

test("첫 방문은 포커스를 빼앗지 않고 직접 입력한 해시는 해당 제목으로 연결한다", async () => {
  const button = document.getElementById("other");
  button.focus();
  await mount(AnchorFocus);
  assert.equal(document.activeElement, button);
  await act(() => root.unmount());
  setHash("#features");
  await mount(AnchorFocus);
  assert.equal(document.activeElement, document.querySelector("#features h2"));
});

test("해시 이동은 제목에 포커스를 주고 이전 제목의 임시 tabindex를 정리한다", async () => {
  await mount(AnchorFocus);
  await changeHash("#features");
  const heading = document.querySelector("#features h2");
  assert.equal(document.activeElement, heading);
  assert.equal(heading.tabIndex, -1);
  await changeHash("#guide");
  assert.equal(heading.hasAttribute("tabindex"), false);
  assert.equal(document.activeElement, document.querySelector("#guide h2"));
});

test("기존 tabindex는 보존하고 본문 바로가기는 main에 포커스를 준다", async () => {
  const heading = document.querySelector("#guide h2");
  heading.tabIndex = 0;
  await mount(AnchorFocus);
  await changeHash("#guide");
  await changeHash("#main-content");
  assert.equal(heading.tabIndex, 0);
  assert.equal(document.activeElement, document.querySelector("main"));
});

test("동일한 해시를 다시 실행해도 포커스가 이동하고 기본 링크 동작은 취소하지 않는다", async () => {
  setHash("#guide");
  await mount(AnchorFocus);
  document.getElementById("other").focus();
  const event = new window.MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
  await act(() => {
    document.querySelector("#link span").dispatchEvent(event);
    flushFrames();
  });
  assert.equal(event.defaultPrevented, false);
  assert.equal(document.activeElement, document.querySelector("#guide h2"));
});

test("수정키·중간 클릭·새 탭·다운로드 링크의 포커스를 가로채지 않는다", async () => {
  setHash("#guide");
  await mount(AnchorFocus);
  const link = document.getElementById("link");
  const button = document.getElementById("other");
  const cases = [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { target: "_blank" }, { download: "file" }];
  for (const entry of cases) {
    link.removeAttribute("target");
    link.removeAttribute("download");
    if (entry.target) link.target = entry.target;
    if (entry.download) link.download = entry.download;
    button.focus();
    const event = new window.MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...entry });
    await act(() => { link.querySelector("span").dispatchEvent(event); flushFrames(); });
    assert.equal(event.defaultPrevented, false);
    assert.equal(document.activeElement, button);
  }
});

test("해시 없는 URL로 돌아오면 홈 제목에 포커스를 주며 이전 예약 작업을 취소한다", async () => {
  setHash("#guide");
  await mount(AnchorFocus);
  document.querySelector("#link span").dispatchEvent(new window.MouseEvent("click", { bubbles: true, button: 0 }));
  await changeHash("");
  await act(flushFrames);
  assert.equal(document.activeElement, document.querySelector("h1"));
});

test("잘못된 해시나 없는 대상은 무시하고 언마운트 시 포커스 보완을 해제한다", async () => {
  await mount(AnchorFocus);
  const button = document.getElementById("other");
  button.focus();
  await changeHash("#missing");
  await changeHash("#%E0%A4%A");
  assert.equal(document.activeElement, button);
  await changeHash("#guide");
  const heading = document.querySelector("#guide h2");
  await act(() => root.unmount());
  root = undefined;
  assert.equal(heading.hasAttribute("tabindex"), false);
  button.focus();
  await changeHash("#features");
  assert.equal(document.activeElement, button);
});

test("현재 메뉴는 전체 wrapper 대신 섹션 경계를 따르며 연속 이벤트를 한 프레임에 처리한다", async () => {
  const positions = { features: 900, guide: 1600, process: 2400, contact: 3200 };
  for (const [id] of Object.entries(positions)) {
    document.getElementById(id).getBoundingClientRect = () => ({ top: positions[id] });
  }
  await mount(HeaderNavigation);
  await act(flushFrames);
  const active = () => [...document.querySelectorAll("nav a[aria-current='location']")].map((link) => link.getAttribute("href"));
  assert.deepEqual(active(), ["#home"]);
  positions.features = -900;
  positions.guide = 24;
  await act(() => {
    window.dispatchEvent(new window.Event("scroll"));
    window.dispatchEvent(new window.Event("resize"));
    assert.equal(frames.size, 1);
    flushFrames();
  });
  assert.deepEqual(active(), ["#guide"]);
  positions.process = -1000;
  positions.contact = 24;
  await act(() => { window.dispatchEvent(new window.Event("scroll")); flushFrames(); });
  assert.deepEqual(active(), ["#contact"]);
});
