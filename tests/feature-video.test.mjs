import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { after, afterEach, beforeEach, test } from "node:test";
import { Window } from "happy-dom";
import ts from "typescript";

// Deterministic DOM/media protocol tests only. No network, decoder, or browser paint.
const window = new Window({ settings: { disableJavaScriptEvaluation: true, disableJavaScriptFileLoading: true, disableCSSFileLoading: true } });
Object.assign(globalThis, { window, document: window.document, Element: window.Element, HTMLElement: window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true });
const { act, createElement } = await import("react");
const { createRoot } = await import("react-dom/client");
const source = new URL("../src/components/journey/feature-video-motion.tsx", import.meta.url);
const module = { exports: {} };
const compiled = ts.transpileModule(fs.readFileSync(source, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
new Function("require", "module", "exports", compiled)(createRequire(source), module, module.exports);
const { FeatureVideoMotion } = module.exports;

let root, now, nextId, hidden, media, positions, states, intersections, sizes, resolveFonts;
const frames = new Map();
const timers = new Map();
window.requestAnimationFrame = (callback) => { frames.set(++nextId, callback); return nextId; };
window.cancelAnimationFrame = (id) => frames.delete(id);
window.setTimeout = (callback, delay) => { const id = ++nextId; timers.set(id, { at: now + delay, callback }); return id; };
window.clearTimeout = (id) => timers.delete(id);
window.matchMedia = () => media;
Object.defineProperty(window, "innerHeight", { configurable: true, value: 1000 });
Object.defineProperty(document, "hidden", { configurable: true, get: () => hidden });

class NearObserver {
  constructor(callback, options) { this.callback = callback; this.options = options; this.targets = []; this.disconnected = false; intersections.push(this); }
  observe(target) { this.targets.push(target); }
  disconnect() { this.disconnected = true; }
}
class SizeObserver {
  constructor(callback) { this.callback = callback; this.targets = []; this.disconnected = false; sizes.push(this); }
  observe(target) { this.targets.push(target); }
  disconnect() { this.disconnected = true; }
}
globalThis.IntersectionObserver = NearObserver;
globalThis.ResizeObserver = SizeObserver;

function flushFrames() {
  const pending = [...frames.values()]; frames.clear();
  for (const callback of pending) callback(now);
}
function tick(milliseconds) {
  const target = now + milliseconds;
  let iterations = 0;
  while (true) {
    const entry = [...timers].filter(([, value]) => value.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
    if (!entry) break;
    assert(++iterations < 100, "The controller must not spin on a timer");
    const [id, value] = entry; timers.delete(id); now = value.at; value.callback();
  }
  now = target;
}
async function mount() {
  const host = document.createElement("div"); document.body.append(host);
  root = createRoot(host);
  await act(() => root.render(createElement(FeatureVideoMotion)));
}
async function scroll() {
  await act(() => { window.dispatchEvent(new window.Event("scroll")); flushFrames(); });
}
async function advance(milliseconds = 180) {
  await act(async () => { tick(milliseconds); await Promise.resolve(); await Promise.resolve(); });
}
async function motion(matches) {
  media.matches = matches;
  await act(() => { for (const callback of media.listeners) callback(); flushFrames(); });
}
async function visibility(value) {
  hidden = value;
  await act(() => { document.dispatchEvent(new window.Event("visibilitychange")); flushFrames(); });
}
const videos = () => [...document.querySelectorAll("video[data-feature-video]")];
const playing = () => states.flatMap((state, index) => state.paused ? [] : [index]);

beforeEach(() => {
  now = 0; nextId = 0; hidden = false;
  frames.clear(); timers.clear();
  intersections = []; sizes = [];
  positions = [300, 1400, 2500, 3600];
  states = [];
  media = { matches: false, listeners: new Set(), addEventListener(type, callback) { assert.equal(type, "change"); this.listeners.add(callback); }, removeEventListener(type, callback) { assert.equal(type, "change"); this.listeners.delete(callback); } };
  Object.defineProperty(document, "fonts", { configurable: true, value: { ready: new Promise((resolve) => { resolveFonts = resolve; }) } });
  document.body.innerHTML = `<section id="features">${positions.map((_, index) => `<video data-feature-video="${index}" src="/fixture-${index}.mp4" loop muted playsinline preload="none"></video>`).join("")}</section>`;
  videos().forEach((video, index) => {
    const state = { paused: true, readyState: 0, plays: 0, pauses: 0, loads: 0, mode: "immediate", pending: [] };
    states.push(state);
    Object.defineProperty(video, "paused", { configurable: true, get: () => state.paused });
    Object.defineProperty(video, "readyState", { configurable: true, get: () => state.readyState });
    video.getBoundingClientRect = () => ({ top: positions[index], bottom: positions[index] + 400, height: 400 });
    const begin = () => { state.paused = false; video.dispatchEvent(new window.Event("play")); };
    video.play = () => {
      state.plays++;
      if (state.mode === "reject") return Promise.reject(new Error("Autoplay is blocked"));
      if (state.mode === "deferred") return new Promise((resolve) => { state.pending.push(() => { begin(); resolve(); }); });
      begin(); return Promise.resolve();
    };
    video.pause = () => {
      state.pauses++;
      if (state.paused) return;
      state.paused = true; video.dispatchEvent(new window.Event("pause"));
    };
    video.load = () => { state.loads++; state.readyState = 1; };
  });
});
afterEach(async () => {
  if (root) await act(() => root.unmount());
  root = undefined; frames.clear(); timers.clear();
});
after(async () => { await window.happyDOM.abort(); window.close(); });

test("중앙의 영상은 짧은 지연 후 무음으로 하나만 재생한다", async () => {
  await mount();
  assert.deepEqual(playing(), []);
  await advance(179);
  assert.equal(states[0].plays, 0);
  await advance(1);
  assert.deepEqual(playing(), [0]);
  assert(videos()[0].muted);
  assert(videos()[0].defaultMuted);
  assert.equal(videos()[0].dataset.autoplayState, "playing");
  assert.equal(states[0].loads, 1);
  assert(states.slice(1).every((state) => state.plays === 0));
});

test("중앙을 빠르게 스친 영상의 예약 재생은 취소한다", async () => {
  await mount();
  await advance(90);
  positions[0] = -900;
  await scroll();
  await advance(1000);
  assert(states.every((state) => state.plays === 0));
  assert.equal(timers.size, 0);
});

test("다음 영상이 중앙에 오면 이전 영상을 멈추고 되돌아와도 재생 위치를 보존한다", async () => {
  await mount(); await advance();
  videos()[0].currentTime = 7.5;
  positions[0] = -900; positions[1] = 300;
  await scroll();
  assert.deepEqual(playing(), []);
  await advance();
  assert.deepEqual(playing(), [1]);
  assert.equal(videos()[0].currentTime, 7.5);
  positions[0] = 300; positions[1] = 1400;
  await scroll(); await advance();
  assert.deepEqual(playing(), [0]);
  assert.equal(videos()[0].currentTime, 7.5);
  await act(() => { for (let index = 0; index < 30; index++) window.dispatchEvent(new window.Event("scroll")); });
  assert.equal(frames.size, 1);
  await act(flushFrames); await advance(1000);
  assert.equal(states[0].plays, 2, "Repeated scroll events must not repeatedly call play()");
  assert.equal(frames.size, 0, "There must be no perpetual animation loop");
});

test("현재 영상이 아직 보이면 유지하고 화면을 벗어나면 일시정지한다", async () => {
  await mount(); await advance();
  positions[0] = -300;
  await scroll();
  assert.deepEqual(playing(), [0]);
  positions[0] = -330;
  await scroll();
  assert.deepEqual(playing(), []);
});

test("사용자가 멈춘 영상은 스크롤로 다시 켜지지 않고 떠났다가 돌아오면 이어 재생한다", async () => {
  await mount(); await advance();
  videos()[0].currentTime = 4;
  await act(() => videos()[0].pause());
  await scroll(); await advance(1000);
  assert.deepEqual(playing(), []);
  assert.equal(states[0].plays, 1);
  positions[0] = -900; await scroll();
  positions[0] = 300; await scroll(); await advance();
  assert.deepEqual(playing(), [0]);
  assert.equal(videos()[0].currentTime, 4);
});

test("숨긴 탭에서는 멈추고 다시 보일 때만 중앙 영상이 재생된다", async () => {
  await mount(); await advance();
  await visibility(true); await advance(1000);
  assert.deepEqual(playing(), []);
  assert.equal(states[0].plays, 1);
  await visibility(false); await advance();
  assert.deepEqual(playing(), [0]);
  assert.equal(states[0].plays, 2);
});

test("동작 줄이기는 자동재생만 막고 수동 재생은 허용하며 변경 즉시 멈춘다", async () => {
  media.matches = true;
  await mount(); await advance(1000);
  assert.equal(states[0].plays, 0);
  await act(() => videos()[0].play());
  assert.deepEqual(playing(), [0]);
  await motion(false); await advance();
  assert.deepEqual(playing(), [0]);
  await motion(true);
  assert.deepEqual(playing(), []);
  await advance(1000);
  assert.equal(states[0].plays, 2);
});

test("자동재생 거부를 무한 재시도하지 않고 화면에 다시 들어올 때 복구한다", async () => {
  states[0].mode = "reject";
  await mount(); await advance();
  assert.equal(videos()[0].dataset.autoplayState, "blocked");
  for (let index = 0; index < 4; index++) { await scroll(); await advance(500); }
  assert.equal(states[0].plays, 1);
  positions[0] = -900; await scroll();
  states[0].mode = "immediate";
  positions[0] = 300; await scroll(); await advance();
  assert.deepEqual(playing(), [0]);
  assert.equal(states[0].plays, 2);
});

test("늦게 끝난 이전 play 요청이 다음 영상과 동시에 재생되지 않는다", async () => {
  states[0].mode = "deferred";
  await mount(); await advance();
  assert.equal(states[0].pending.length, 1);
  positions[0] = -900; positions[1] = 300;
  await scroll(); await advance();
  assert.deepEqual(playing(), [1]);
  await act(async () => { states[0].pending.shift()(); await Promise.resolve(); });
  assert.deepEqual(playing(), [1]);
});

test("근처 영상 메타데이터는 한 번만 준비하고 그 자체로 재생하지 않는다", async () => {
  positions[0] = 1200;
  await mount();
  assert.equal(intersections[0].options.rootMargin, "600px 0px");
  const entry = { isIntersecting: true, target: videos()[0] };
  await act(() => { intersections[0].callback([entry]); intersections[0].callback([entry]); });
  assert.equal(states[0].loads, 1);
  assert.equal(videos()[0].preload, "metadata");
  assert.equal(states[0].plays, 0);
  positions[0] = 300; await scroll(); await advance();
  assert.equal(states[0].loads, 1);
  assert.deepEqual(playing(), [0]);
});

test("언마운트 시 예약·관찰을 해제하고 늦은 재생 완료도 정지한다", async () => {
  states[0].mode = "deferred";
  await mount(); await advance();
  await act(() => window.dispatchEvent(new window.Event("resize")));
  assert.equal(frames.size, 1);
  await act(() => root.unmount()); root = undefined;
  assert.equal(frames.size, 0);
  assert.equal(timers.size, 0);
  assert(intersections[0].disconnected);
  assert(sizes[0].disconnected);
  assert.equal(media.listeners.size, 0);
  await act(async () => { states[0].pending.shift()(); resolveFonts(); await Promise.resolve(); });
  assert.deepEqual(playing(), []);
  assert.equal(frames.size, 0);
});

test("동영상이 없는 화면에서는 이벤트와 관찰을 시작하지 않는다", async () => {
  document.getElementById("features").remove();
  await mount();
  await scroll(); await advance(1000);
  assert.equal(frames.size, 0);
  assert.equal(timers.size, 0);
  assert.equal(intersections.length, 0);
  assert.equal(sizes.length, 0);
  assert.equal(media.listeners.size, 0);
});
