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
let scrollPosition = 0;
let documentHeight = 6000;
let reducedMotion = false;
let scrollCalls = [];
let pushCalls = [];
let currentHash = "";
let historyState = null;
// Happy DOM emits hashchange even from pushState/replaceState. Real browsers do
// not: isolate those API calls, then dispatch history/hash events explicitly.
Object.defineProperty(window.location, "hash", { configurable: true, get: () => currentHash });
Object.defineProperty(window.history, "state", { configurable: true, get: () => historyState });
window.requestAnimationFrame = (callback) => { frames.set(++frameId, callback); return frameId; };
window.cancelAnimationFrame = (id) => frames.delete(id);
Object.defineProperty(window, "scrollY", { configurable: true, get: () => scrollPosition });
Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
Object.defineProperty(window.document.documentElement, "scrollHeight", { configurable: true, get: () => documentHeight });
window.scrollTo = (options) => {
  assert.equal(typeof options, "object", "Each animated position must use explicit scroll options");
  scrollCalls.push({ ...options });
  scrollPosition = options.top;
};
window.matchMedia = (query) => ({
  matches: query === "(prefers-reduced-motion: reduce)" && reducedMotion,
  media: query,
  addEventListener() {},
  removeEventListener() {},
});
window.history.pushState = (state, title, url) => {
  pushCalls.push({ state, title, url });
  historyState = state;
  if (url) currentHash = new URL(url, window.location.href).hash;
};
window.history.replaceState = (state, _title, url) => {
  historyState = state;
  if (url) currentHash = new URL(url, window.location.href).hash;
};

function flushFrames(timestamp = 0) {
  const pending = [...frames.values()];
  frames.clear();
  for (const callback of pending) callback(timestamp);
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

async function advanceFrame(timestamp) {
  await act(() => flushFrames(timestamp));
}

async function clickLink(href = "#guide", options = {}) {
  const link = document.getElementById("link");
  link.setAttribute("href", href);
  const event = new window.MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...options });
  await act(() => link.querySelector("span").dispatchEvent(event));
  return event;
}

beforeEach(() => {
  frames.clear();
  scrollPosition = 0;
  documentHeight = 6000;
  reducedMotion = false;
  scrollCalls = [];
  pushCalls = [];
  setHash("");
  document.body.innerHTML = `
    <div id="home"><h1>홈</h1><main id="main-content">
      <section id="features"><h2>기능</h2><article id="feature-sources"><h3>자료 준비</h3></article></section>
      <section id="guide"><h2>안내</h2></section>
      <section id="process"><h2>과정</h2></section>
      <section id="contact"><h2>문의</h2></section>
    </main></div>
    <button id="other">다른 동작</button>
    <a id="link" href="#guide"><span>안내로 이동</span></a>`;
  const positions = {
    "#home": 0,
    "#home > h1": 180,
    "#main-content": 160,
    "#features": 900,
    "#features h2": 1030,
    "#feature-sources": 1300,
    "#feature-sources h3": 1700,
    "#guide": 1900,
    "#guide h2": 2030,
    "#process": 3000,
    "#process h2": 3130,
    "#contact": 4800,
    "#contact h2": 4930,
  };
  for (const [selector, position] of Object.entries(positions)) {
    document.querySelector(selector).getBoundingClientRect = () => ({ top: position - scrollPosition });
  }
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

test("기능 카드 링크는 카드의 h3 제목으로 키보드 포커스를 연결한다", async () => {
  await mount(AnchorFocus);
  await changeHash("#feature-sources");
  const heading = document.querySelector("#feature-sources h3");
  assert.equal(document.activeElement, heading);
  assert.equal(heading.tabIndex, -1);
  await changeHash("#home");
  assert.equal(heading.hasAttribute("tabindex"), false);
});

test("동일한 해시를 다시 실행하면 추가 이력 없이 이동하고 완료 후 포커스를 준다", async () => {
  setHash("#guide");
  await mount(AnchorFocus);
  document.getElementById("other").focus();
  const event = await clickLink();
  assert.equal(event.defaultPrevented, true);
  assert.equal(pushCalls.length, 0);
  assert.equal(document.activeElement, document.getElementById("other"));
  await advanceFrame(0);
  await advanceFrame(1000);
  assert.equal(scrollPosition, 1998);
  assert.equal(document.activeElement, document.querySelector("#guide h2"));
});

test("섹션 제목 위에 감속하며 도착하고 기존 history.state와 해시를 보존한다", async () => {
  const state = { __NA: true, tree: ["preserved"] };
  window.history.replaceState(state, "", "/");
  const other = document.getElementById("other");
  other.focus();
  await mount(AnchorFocus);
  const event = await clickLink();
  assert.equal(event.defaultPrevented, true);
  assert.equal(window.location.hash, "#guide");
  assert.equal(pushCalls.length, 1);
  assert.deepEqual(pushCalls[0].state, state);
  assert.equal(pushCalls[0].url, "#guide");
  assert.equal(scrollCalls.length, 0, "No native jump before the animation starts");
  await advanceFrame(100);
  assert.equal(scrollPosition, 0);
  await advanceFrame(200);
  const firstStep = scrollPosition;
  assert(firstStep > 0 && firstStep < 1000);
  assert.equal(document.activeElement, other, "Focus must not jump ahead of the visual transition");
  await advanceFrame(370);
  assert(scrollPosition > firstStep && scrollPosition < 1998);
  await advanceFrame(500);
  const nearEnd = scrollPosition;
  assert(nearEnd > 1500 && nearEnd < 1998);
  await advanceFrame(1000);
  assert.equal(scrollPosition, 1998, "Align heading rather than the section's empty top padding");
  assert(scrollCalls.every((call) => call.behavior === "instant"), "CSS smooth must not restart within every frame");
  assert.equal(frames.size, 0);
  assert.equal(document.activeElement, document.querySelector("#guide h2"));
});

test("긴 이동은 900ms 안에 끝나고 짧은 이동도 첫 프레임에 튀지 않는다", async () => {
  await mount(AnchorFocus);
  await clickLink("#contact");
  await advanceFrame(0);
  await advanceFrame(800);
  assert(scrollPosition < 4898);
  await advanceFrame(900);
  assert.equal(scrollPosition, 4898);
  scrollPosition = 1988;
  document.getElementById("other").focus();
  await clickLink("#guide");
  await advanceFrame(1000);
  assert.equal(scrollPosition, 1988);
  await advanceFrame(1399);
  assert(scrollPosition < 1998);
  await advanceFrame(1400);
  assert.equal(scrollPosition, 1998);
});

test("새로운 유효 클릭은 이동 중 위치에서 시작하고 이전 도착지로 포커스를 보내지 않는다", async () => {
  await mount(AnchorFocus);
  document.getElementById("other").focus();
  await clickLink("#contact");
  await advanceFrame(0);
  await advanceFrame(350);
  const interruptedPosition = scrollPosition;
  assert(interruptedPosition > 0 && interruptedPosition < 4898);
  await clickLink("#features");
  assert.equal(frames.size, 1, "Only the replacement animation may remain scheduled");
  await advanceFrame(400);
  assert.equal(scrollPosition, interruptedPosition);
  await advanceFrame(1400);
  assert.equal(scrollPosition, 998);
  assert.equal(document.activeElement, document.querySelector("#features h2"));
  assert.equal(document.querySelector("#contact h2").hasAttribute("tabindex"), false);
});

test("동작 줄이기와 본문 바로가기는 애니메이션 없이 즉시 이동한다", async () => {
  reducedMotion = true;
  await mount(AnchorFocus);
  await clickLink("#guide");
  assert.equal(frames.size, 0);
  assert.equal(scrollPosition, 1998);
  assert.equal(document.activeElement, document.querySelector("#guide h2"));
  reducedMotion = false;
  await clickLink("#main-content");
  assert.equal(frames.size, 0);
  assert.equal(document.activeElement, document.querySelector("main"));
});

test("홈은 제목 위치 대신 맨 위로 이동하고 문서 범위를 넘는 목적지는 제한한다", async () => {
  reducedMotion = true;
  scrollPosition = 2000;
  await mount(AnchorFocus);
  await clickLink("#home");
  assert.equal(scrollPosition, 0);
  assert.equal(document.activeElement, document.querySelector("h1"));
  documentHeight = 5000;
  await clickLink("#contact");
  assert.equal(scrollPosition, 4200);
  document.querySelector("#guide h2").getBoundingClientRect = () => ({ top: -10000 });
  await clickLink("#guide");
  assert.equal(scrollPosition, 0);
});

test("기능 카드 이동은 내부 소제목 대신 카드 시작에 정렬하고 h3에 포커스를 준다", async () => {
  reducedMotion = true;
  await mount(AnchorFocus);
  await clickLink("#feature-sources");
  assert.equal(scrollPosition, 1268);
  assert.equal(document.activeElement, document.querySelector("#feature-sources h3"));
});

test("사용자 조작·크기 변경·이력 이동은 진행 중 이동과 예약 포커스를 취소한다", async () => {
  await mount(AnchorFocus);
  const interrupts = [
    () => window.dispatchEvent(new window.WheelEvent("wheel")),
    () => window.dispatchEvent(new window.Event("touchstart")),
    () => window.dispatchEvent(new window.Event("pointerdown")),
    ...["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab", "Escape"].map((key) => () => window.dispatchEvent(new window.KeyboardEvent("keydown", { key }))),
    () => window.dispatchEvent(new window.Event("resize")),
    () => window.dispatchEvent(new window.PopStateEvent("popstate")),
  ];
  for (const interrupt of interrupts) {
    const other = document.getElementById("other");
    other.focus();
    scrollPosition = 0;
    await clickLink();
    await advanceFrame(0);
    await advanceFrame(120);
    const position = scrollPosition;
    await act(interrupt);
    assert.equal(frames.size, 0);
    await advanceFrame(1000);
    assert.equal(scrollPosition, position);
    assert.equal(document.activeElement, other);
  }
});

test("일반 문자 키는 이동을 취소하지 않고 언마운트는 예약 프레임을 정리한다", async () => {
  await mount(AnchorFocus);
  await clickLink();
  await advanceFrame(0);
  await act(() => window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "a" })));
  assert.equal(frames.size, 1);
  await act(() => root.unmount());
  root = undefined;
  assert.equal(frames.size, 0);
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

test("메일·외부·빈 해시·없는 대상과 이미 취소된 클릭을 가로채지 않는다", async () => {
  await mount(AnchorFocus);
  for (const href of ["mailto:support@hongsik.blog", "https://example.com/#guide", "#", "#missing", "#%E0%A4%A"]) {
    const event = await clickLink(href);
    assert.equal(event.defaultPrevented, false, href);
    assert.equal(frames.size, 0);
  }
  const link = document.getElementById("link");
  link.href = "#guide";
  const canceledEvent = new window.MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
  canceledEvent.preventDefault();
  await act(() => link.dispatchEvent(canceledEvent));
  assert.equal(pushCalls.length, 0);
  assert.equal(frames.size, 0);
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

test("문서 끝의 작은 문의 채널은 상단 경계에 닿지 않아도 표시하고 화면 밖·끝 이전에는 선택하지 않는다", async () => {
  for (const id of ["features", "guide", "process"]) {
    document.getElementById(id).getBoundingClientRect = () => ({ top: -500 });
  }
  document.getElementById("contact").outerHTML = '<nav id="contact" aria-label="문의 채널"><a href="mailto:support@hongsik.blog">이메일</a></nav>';
  let contactTop = 610;
  document.getElementById("contact").getBoundingClientRect = () => ({ top: contactTop, bottom: contactTop + 60 });
  const active = () => document.querySelector("nav[aria-label='상단 메뉴'] a[aria-current='location']")?.getAttribute("href");
  const scroll = async (position) => {
    scrollPosition = position;
    await act(() => { window.dispatchEvent(new window.Event("scroll")); flushFrames(); });
  };

  scrollPosition = 5197; // Three pixels before the end: retain the ordinary section state.
  await mount(HeaderNavigation);
  await act(flushFrames);
  assert.equal(active(), "#process");

  await scroll(5198); // Account for up to two pixels of fractional layout rounding.
  assert.equal(active(), "#contact");

  contactTop = 800; // The contact target below the viewport must not be inferred as visible.
  await scroll(5200);
  assert.equal(active(), "#process");

  contactTop = 610;
  await scroll(5200);
  assert.equal(active(), "#contact");
  await scroll(5100);
  assert.equal(active(), "#process");

  document.getElementById("contact").remove();
  await scroll(5200);
  assert.equal(active(), "#process");
});
