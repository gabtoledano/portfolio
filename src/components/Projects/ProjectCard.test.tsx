import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Project } from "@/types";
import ProjectCard from "./ProjectCard";

// Un faux projet écrit pour le test : on sait exactement ce qui doit s'afficher,
// et le test ne casse pas le jour où l'on modifie les vrais projets du site.
const projet: Project = {
  id: 99,
  title: "Projet test",
  tag: "Front-end",
  description: "Une description de test.",
  stack: ["React", "TypeScript"],
  githubUrl: "https://github.com/exemple/projet-test",
  liveUrl: "https://exemple.com",
  image: "/projet-test.webp",
};

// ProjectCard rend un <li> : on le place dans une liste, comme sur le site.
function afficherCarte(donnees: Project) {
  render(
    <ul>
      <ProjectCard project={donnees} index={0} />
    </ul>,
  );
}

describe("ProjectCard", () => {
  it("affiche le nom du projet comme titre de niveau 3", () => {
    afficherCarte(projet);

    expect(
      screen.getByRole("heading", { level: 3, name: "Projet test" }),
    ).toBeInTheDocument();
  });

  it("décrit l'image pour les lecteurs d'écran", () => {
    afficherCarte(projet);

    expect(
      screen.getByRole("img", { name: "Aperçu du projet Projet test" }),
    ).toBeInTheDocument();
  });

  it("fait pointer le lien « Code » vers le dépôt GitHub", () => {
    afficherCarte(projet);

    // Le nom du lien commence par « Code », suivi d'un texte réservé aux
    // lecteurs d'écran (« de Projet test »). /^code/i = « commence par code ».
    const lien = screen.getByRole("link", { name: /^code/i });
    expect(lien).toHaveAttribute("href", "https://github.com/exemple/projet-test");
  });

  it("n'affiche pas le lien « Code » quand le dépôt est privé", () => {
    afficherCarte({ ...projet, hideGithub: true });

    // queryBy… renvoie null au lieu de planter : c'est la façon de vérifier
    // qu'un élément est absent.
    expect(screen.queryByRole("link", { name: /code/i })).not.toBeInTheDocument();
  });
});
