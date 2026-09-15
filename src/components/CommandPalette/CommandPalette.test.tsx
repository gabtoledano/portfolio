import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/providers/ThemeProvider";
import CommandPalette from "./CommandPalette";

function renderPalette(onClose = vi.fn()) {
  const user = userEvent.setup();
  render(
    <ThemeProvider>
      <CommandPalette open onClose={onClose} />
    </ThemeProvider>,
  );
  return { user, onClose, input: screen.getByRole("combobox") };
}

const optionNames = () =>
  screen.getAllByRole("option").map((option) => option.textContent);

describe("CommandPalette", () => {
  it("prend le focus à l'ouverture", () => {
    const { input } = renderPalette();
    expect(input).toHaveFocus();
  });

  it("liste les commandes groupées par catégorie", () => {
    renderPalette();
    expect(screen.getByRole("group", { name: "Navigation" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Projets" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Thème" })).toBeInTheDocument();
  });

  it("dérive les entrées « Projets » des données du site", () => {
    renderPalette();
    const projects = screen.getByRole("group", { name: "Projets" });
    expect(within(projects).getByText(/ArgentBank/)).toBeInTheDocument();
    expect(within(projects).getByText(/Kasa/)).toBeInTheDocument();
  });

  it("filtre en recherche approximative", async () => {
    const { user, input } = renderPalette();
    await user.type(input, "kasa");

    await waitFor(() => {
      expect(optionNames()).toHaveLength(1);
    });
    expect(optionNames()[0]).toContain("Kasa");
  });

  it("affiche un état vide quand rien ne correspond", async () => {
    const { user, input } = renderPalette();
    await user.type(input, "zzzzzz");

    await waitFor(() => {
      expect(screen.queryAllByRole("option")).toHaveLength(0);
    });
    expect(screen.getByText(/Aucun résultat/)).toBeInTheDocument();
  });

  it("sélectionne la première option et déplace la sélection aux flèches", async () => {
    const { user, input } = renderPalette();
    const options = screen.getAllByRole("option");

    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute("aria-activedescendant", options[0]?.id);

    await user.keyboard("{ArrowDown}");
    expect(options[1]).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowUp}");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
  });

  it("boucle de la première option à la dernière", async () => {
    const { user } = renderPalette();
    const options = screen.getAllByRole("option");

    await user.keyboard("{ArrowUp}");
    expect(options[options.length - 1]).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("exécute la commande sélectionnée à la touche Entrée", async () => {
    const { user, input } = renderPalette();
    await user.type(input, "sombre");
    await waitFor(() => expect(optionNames()[0]).toContain("Thème sombre"));

    await user.keyboard("{Enter}");

    // Le thème traverse le contexte jusqu'à l'attribut du document.
    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("dark");
    });
    expect(localStorage.getItem("gt-theme")).toBe('"dark"');
  });

  it("garde la palette ouverte pour les commandes marquées keepOpen", async () => {
    const { user, input, onClose } = renderPalette();
    await user.type(input, "clair");
    await waitFor(() => expect(optionNames()[0]).toContain("Thème clair"));

    await user.keyboard("{Enter}");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("ferme la palette à la touche Échap", async () => {
    const { user, onClose } = renderPalette();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("ferme la palette après une commande de navigation", async () => {
    const { user, input, onClose } = renderPalette();
    await user.type(input, "contact");
    await waitFor(() => expect(screen.getAllByRole("option").length).toBeGreaterThan(0));

    await user.keyboard("{Enter}");
    expect(onClose).toHaveBeenCalled();
  });
});
