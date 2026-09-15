import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom n'implémente pas matchMedia ; les hooks du site s'appuient dessus.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// Idem pour IntersectionObserver, utilisé par les révélations au scroll.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly scrollMargin = "";
  readonly thresholds: readonly number[] = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

// jsdom ne sait pas défiler : ces deux-là ne sont pas implémentées.
Element.prototype.scrollIntoView = vi.fn();
window.scrollTo = vi.fn();

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

afterEach(cleanup);
