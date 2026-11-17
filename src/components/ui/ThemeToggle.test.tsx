import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ThemeToggle from "./ThemeToggle";

// ThemeToggle lit le thème dans un contexte React : sans son fournisseur
// (ThemeProvider), il n'aurait rien à lire. On l'affiche donc avec.
function afficherSelecteur() {
  const user = userEvent.setup();
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
  return { user };
}

describe("ThemeToggle", () => {
  it("propose trois choix dans un groupe nommé", () => {
    afficherSelecteur();

    const groupe = screen.getByRole("radiogroup", { name: "Apparence du site" });
    expect(within(groupe).getAllByRole("radio")).toHaveLength(3);
  });

  it("coche « Thème sombre » par défaut", () => {
    afficherSelecteur();

    expect(screen.getByRole("radio", { name: "Thème sombre" })).toBeChecked();
  });

  it("passe le site en thème clair au clic", async () => {
    const { user } = afficherSelecteur();

    await user.click(screen.getByRole("radio", { name: "Thème clair" }));

    expect(screen.getByRole("radio", { name: "Thème clair" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Thème sombre" })).not.toBeChecked();
    // C'est cet attribut qui fait basculer les tokens du thème clair en CSS.
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("retient le choix pour la prochaine visite", async () => {
    const { user } = afficherSelecteur();

    await user.click(screen.getByRole("radio", { name: "Thème clair" }));

    expect(localStorage.getItem("gt-theme")).toBe('"light"');
  });
});
