import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "./ThemeContext";
import { ThemeProvider } from "./ThemeProvider";

const originalMatchMedia = window.matchMedia;

/** Fait répondre `prefers-color-scheme: light` à la valeur demandée. */
function mockSystemPrefersLight(prefersLight: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes("prefers-color-scheme: light") && prefersLight,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function Probe() {
  const { preference, theme } = useTheme();
  return <p data-testid="probe">{`${preference}/${theme}`}</p>;
}

const renderProvider = () =>
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );

const probe = () => screen.getByTestId("probe").textContent;

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

describe("ThemeProvider", () => {
  it("affiche le site en sombre par défaut, même si le système demande clair", () => {
    mockSystemPrefersLight(true);
    renderProvider();

    expect(probe()).toBe("dark/dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("respecte une préférence déjà enregistrée", () => {
    mockSystemPrefersLight(false);
    localStorage.setItem("gt-theme", '"light"');
    renderProvider();

    expect(probe()).toBe("light/light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("suit le système quand l'utilisateur a explicitement choisi « système »", () => {
    mockSystemPrefersLight(true);
    localStorage.setItem("gt-theme", '"system"');
    renderProvider();

    expect(probe()).toBe("system/light");
  });

  it("retombe sur le défaut si la valeur stockée est corrompue", () => {
    mockSystemPrefersLight(true);
    localStorage.setItem("gt-theme", '"chartreuse"');
    renderProvider();

    expect(probe()).toBe("dark/dark");
  });

  it("aligne la couleur de la barre du navigateur sur le thème", () => {
    document.head.insertAdjacentHTML(
      "beforeend",
      '<meta name="theme-color" content="#ffffff">',
    );
    mockSystemPrefersLight(true);
    renderProvider();

    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute("content")).toBe("#0a0a14");
    meta?.remove();
  });
});
