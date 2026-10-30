import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { after, afterEach, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import { Window } from "happy-dom";
import ts from "typescript";

// In-memory DOM behavior tests. These do not measure browser layout or paint.
const window = new Window({ url: "http://localhost/" });
Object.assign(globalThis, {
  window,
  document: window.document,
  Element: window.Element,
  HTMLElement: window.HTMLElement,
  IS_REACT_ACT_ENVIRONMENT: true,
});
const { act, createElement } = await import("react");
const { createRoot } = await import("react-dom/client");
const cache = new Map();

function loadTs(relativePath) {
  const filename = fileURLToPath(new URL(relativePath, import.meta.url));
  function evaluate(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const require = createRequire(file);
    const output = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const module = { exports: {} };
    cache.set(file, module);
    const scopedRequire = (name) => {
      if (name.startsWith(".")) {
        const candidate = path.resolve(path.dirname(file), name);
        for (const extension of ["", ".ts", ".tsx"]) {
          if (fs.existsSync(candidate + extension)) return evaluate(candidate + extension);
        }
      }
      return require(name);
    };
    new Function("require", "module", "exports", output)(scopedRequire, module, module.exports);
    return module.exports;
  }
  return evaluate(filename);
}

const { journeyProgress } = loadTs("../src/components/journey/journey-progress.ts");
const { JourneyMotion } = loadTs("../src/components/journey/journey-motion.tsx");
const { AnchorFocus } = loadTs("../src/components/navigation/anchor-focus.tsx");
let root;
let nextFrame = 0;
const frames = new Map();
let scrollPosition;
let tops;
let media;
let observers;
let resolveFonts;

window.requestAnimationFrame = (callback) => { frames.set(++nextFrame, callback); return nextFrame; };
window.cancelAnimationFrame = (id) => frames.delete(id);
window.matchMedia = () => media;
Object.defineProperty(window, "innerHeight", { configurable: true, value: 1000, writable: true });
Object.defineProperty(window, "innerWidth", { configurable: true, value: 1200, writable: true });
Object.defineProperty(window, "scrollY", { configurable: true, get: () => scrollPosition });
Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 10000 });
window.scrollTo = ({ top, behavior }) => { assert.equal(behavior, "instant"); scrollPosition = top; };

class TestResizeObserver {
  constructor(callback) { this.callback = callback; this.targets = []; this.disconnected = false; observers.push(this); }
  observe(target) { this.targets.push(target); }
  disconnect() { this.disconnected = true; }
}
globalThis.ResizeObserver = TestResizeObserver;

function flush() {
  const pending = [...frames.values()];
  frames.clear();
  for (const callback of pending) callback(0);
}
async function mount(Component = JourneyMotion) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  await act(() => root.render(createElement(Component)));
}
async function event(type) {
  await act(() => window.dispatchEvent(new window.Event(type)));
}
async function changeMotion(matches) {
  media.matches = matches;
  await act(() => { for (const callback of media.listeners) callback(); });
}
const section = () => document.getElementById("features");
const offsets = () => [...document.querySelectorAll("[data-curve-segment]")].map((node) => Number(node.style.strokeDashoffset));
const reached = () => [...document.querySelectorAll("[data-journey-card]")].map((card) => card.dataset.reached);
const current = () => [...document.querySelectorAll("[data-journey-link][aria-current]")].map((link) => link.dataset.journeyLink);

beforeEach(() => {
  frames.clear();
  scrollPosition = 0;
  window.innerWidth = 1200;
  tops = [1000, 1400, 1800, 2200, 2600];
  observers = [];
  media = {
    matches: false,
    listeners: new Set(),
    addEventListener(type, callback) { assert.equal(type, "change"); this.listeners.add(callback); },
    removeEventListener(type, callback) { assert.equal(type, "change"); this.listeners.delete(callback); },
  };
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { ready: new Promise((resolve) => { resolveFonts = resolve; }) },
  });
  document.body.innerHTML = `<section id="features">
    <b data-journey-counter>01</b>
    <svg>${Array.from({ length: 4 }, (_, index) => `<path data-curve-segment="${index}" />`).join("")}${Array.from({ length: 5 }, (_, index) => `<g data-curve-node="${index}" />`).join("")}</svg>
    ${Array.from({ length: 5 }, (_, index) => `<a href="#card-${index}" data-journey-link="${index}">기능 ${index + 1}</a><article id="card-${index}" data-journey-card><h3>기능 설명</h3></article>`).join("")}
  </section>`;
  [...document.querySelectorAll("[data-journey-card]")].forEach((card, index) => {
    card.getBoundingClientRect = () => ({ top: tops[index] - scrollPosition });
  });
});
afterEach(async () => {
  if (root) await act(() => root.unmount());
  root = undefined;
  frames.clear();
});
after(async () => { await window.happyDOM.abort(); window.close(); });

test("진행률은 빈 목록·단일 카드·시작 전·마지막 이후를 안전하게 제한한다", () => {
  assert.equal(journeyProgress([], 50), 0);
  assert.equal(journeyProgress([100], 1000), 0);
  assert.equal(journeyProgress([100, 300, 800], -100), 0);
  assert.equal(journeyProgress([100, 300, 800], 100), 0);
  assert.equal(journeyProgress([100, 300, 800], 800), 2);
  assert.equal(journeyProgress([100, 300, 800], 10000), 2);
});

test("높이가 다른 카드 사이를 연속 보간하고 위로 돌아가면 진행률도 감소한다", () => {
  const measured = [100, 300, 800, 950, 1500];
  assert.equal(journeyProgress(measured, 200), .5);
  assert.equal(journeyProgress(measured, 400), 1.2);
  assert.equal(journeyProgress(measured, 875), 2.5);
  assert.equal(journeyProgress(measured, 1225), 3.5);
  assert(Math.abs(journeyProgress(measured, 300 - .001) - journeyProgress(measured, 300 + .001)) < .00001);
  const reverse = [1500, 1225, 875, 400, 100].map((boundary) => journeyProgress(measured, boundary));
  assert(reverse.every((progress, index) => index === 0 || progress < reverse[index - 1]));
});

test("초기 복원 위치를 바로 반영하고 역스크롤 시 선·노드·메뉴를 함께 되돌린다", async () => {
  scrollPosition = 1050;
  await mount();
  assert.equal(section().dataset.journeyReady, "true");
  assert.deepEqual(offsets(), [0, .5, 1, 1]);
  assert.deepEqual(reached(), ["true", "true", "false", "false", "false"]);
  assert.deepEqual(current(), ["1"]);
  assert.equal(document.querySelector("[data-journey-counter]").textContent, "02");
  assert.deepEqual([...document.querySelectorAll("[data-curve-node]")].map((node) => node.dataset.reached), reached());
  scrollPosition = 500;
  await event("scroll");
  await act(flush);
  assert.deepEqual(offsets(), [.875, 1, 1, 1]);
  assert.deepEqual(reached(), ["true", "false", "false", "false", "false"]);
  assert.deepEqual(current(), ["0"]);
});

test("빠른 이동은 마지막 단계까지 따라가고 스크롤 이벤트는 프레임 하나로 합친다", async () => {
  await mount();
  scrollPosition = 3000;
  await act(() => {
    for (const type of ["scroll", "scroll", "resize", "hashchange", "pageshow", "load"]) window.dispatchEvent(new window.Event(type));
  });
  assert.equal(frames.size, 1);
  await act(flush);
  assert.deepEqual(offsets(), [0, 0, 0, 0]);
  assert.deepEqual(reached(), Array(5).fill("true"));
  assert.deepEqual(current(), ["4"]);
  assert.equal(frames.size, 0, "The effect must not run a perpetual animation loop");
});

test("높이 변경 관찰과 폰트 준비 후 카드 위치를 새로 읽는다", async () => {
  scrollPosition = 1000;
  await mount();
  assert.equal(observers.length, 1);
  assert.equal(observers[0].targets.length, 5);
  assert.deepEqual(offsets(), [0, .625, 1, 1]);
  tops = [1000, 2000, 3000, 4000, 5000];
  await act(() => observers[0].callback());
  await act(flush);
  assert(Math.abs(offsets()[0] - .45) < 1e-12);
  assert.deepEqual(offsets().slice(1), [1, 1, 1]);
  tops = [1000, 1400, 1800, 2200, 2600];
  await act(async () => { resolveFonts(); await Promise.resolve(); });
  assert.equal(frames.size, 1);
  await act(flush);
  assert.deepEqual(offsets(), [0, .625, 1, 1]);
});

test("동작 줄이기는 모든 설명을 강조하고 실행 중 설정 변경도 반영한다", async () => {
  media.matches = true;
  await mount();
  assert.deepEqual(offsets(), [0, 0, 0, 0]);
  assert.deepEqual(reached(), Array(5).fill("true"));
  await changeMotion(false);
  await act(flush);
  assert.deepEqual(offsets(), [1, 1, 1, 1]);
  assert.deepEqual(reached(), ["true", "false", "false", "false", "false"]);
  await changeMotion(true);
  await act(flush);
  assert.deepEqual(offsets(), [0, 0, 0, 0]);
  assert.deepEqual(reached(), Array(5).fill("true"));
});

test("언마운트 시 예약 프레임·관찰·이벤트를 정리하고 늦은 폰트 완료도 무시한다", async () => {
  await mount();
  await event("scroll");
  assert.equal(frames.size, 1);
  await act(() => root.unmount());
  root = undefined;
  assert.equal(frames.size, 0);
  assert.equal(observers[0].disconnected, true);
  assert.equal(media.listeners.size, 0);
  assert.equal(section().hasAttribute("data-journey-ready"), false);
  await act(async () => {
    for (const type of ["scroll", "resize", "hashchange", "pageshow", "load"]) window.dispatchEvent(new window.Event(type));
    observers[0].callback();
    resolveFonts();
    await Promise.resolve();
  });
  assert.equal(frames.size, 0);
});

test("기능 섹션이 없는 화면에서는 이벤트나 관찰을 시작하지 않는다", async () => {
  section().remove();
  await mount();
  await event("scroll");
  assert.equal(frames.size, 0);
  assert.equal(observers.length, 0);
  assert.equal(media.listeners.size, 0);
});

test("모바일 기능 링크는 고정 탐색바 아래로 이동하고 별칭 링크도 카드 제목에 포커스를 준다", async () => {
  media.matches = true;
  window.innerWidth = 390;
  const navigation = document.createElement("aside");
  navigation.setAttribute("data-journey-nav", "");
  navigation.getBoundingClientRect = () => ({ height: 125 });
  section().prepend(navigation);
  const alias = document.createElement("span");
  alias.id = "feature-indexing";
  alias.getBoundingClientRect = () => ({ top: tops[2] - scrollPosition });
  document.getElementById("card-2").prepend(alias);
  const link = document.createElement("a");
  link.href = "#feature-indexing";
  link.textContent = "색인 보기";
  document.body.append(link);
  await mount(AnchorFocus);
  const click = new window.MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
  await act(() => link.dispatchEvent(click));
  assert.equal(click.defaultPrevented, true);
  assert.equal(scrollPosition, 1800 - 125 - 20);
  assert.equal(document.activeElement, document.querySelector("#card-2 h3"));
  assert.equal(alias.hasAttribute("tabindex"), false, "Decorative alias must not receive focus");

  window.innerWidth = 1200;
  await act(() => link.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })));
  assert.equal(scrollPosition, 1800 - 32, "Desktop navigation must retain the existing 32px alignment");
});
