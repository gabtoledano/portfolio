import { useMemo } from "react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useTheme } from "@/providers/ThemeContext";
import { projects } from "@/data/projects";
import { SECTIONS, site } from "@/data/site";
import { scrollToSection } from "@/lib/scrollToSection";
import type { Command } from "@/types";
import {
  IconArrowRight,
  IconCopy,
  IconFile,
  IconFolder,
  IconGithub,
  IconLinkedin,
  IconMail,
  IconMonitor,
  IconMoon,
  IconSun,
} from "@/components/Icons/Icons";

function openExternal(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Construit le catalogue de commandes de la palette.
 *
 * Les entrées « Navigation » et « Projets » sont dérivées des données du site :
 * ajouter un projet dans `data/projects.ts` le rend immédiatement accessible
 * au clavier, sans toucher à la palette.
 */
export function useCommands(): Command[] {
  const { preference, setPreference } = useTheme();
  const { copied, copy } = useCopyToClipboard();

  return useMemo<Command[]>(() => {
    const navigation: Command[] = [
      {
        id: "nav-top",
        label: "Retour en haut",
        group: "Navigation",
        icon: <IconArrowRight size={16} />,
        keywords: ["accueil", "home", "hero"],
        perform: () => scrollToSection("top"),
      },
      ...SECTIONS.map<Command>((section) => ({
        id: `nav-${section.id}`,
        label: section.label,
        group: "Navigation",
        icon: <IconArrowRight size={16} />,
        hint: `Section ${section.index}`,
        keywords: [section.id],
        perform: () => scrollToSection(section.id),
      })),
    ];

    const projectCommands = projects.map<Command>((project) => ({
      id: `project-${project.id}`,
      label: `Ouvrir ${project.title}`,
      group: "Projets",
      icon: <IconFolder size={16} />,
      hint: project.tag,
      keywords: project.stack,
      perform: () => openExternal(project.liveUrl ?? project.githubUrl),
    }));

    const actions: Command[] = [
      {
        id: "action-cv",
        label: "Télécharger mon CV",
        group: "Actions",
        icon: <IconFile size={16} />,
        hint: "PDF",
        keywords: ["cv", "resume", "pdf"],
        perform: () => openExternal(site.cvUrl),
      },
      {
        id: "action-copy-email",
        label: "Copier mon adresse e-mail",
        group: "Actions",
        icon: <IconCopy size={16} />,
        hint: copied ? "Copié ✓" : site.email,
        keywords: ["mail", "contact", "presse-papier"],
        // Reste ouverte pour que le retour « Copié ✓ » soit visible.
        keepOpen: true,
        perform: () => void copy(site.email),
      },
      {
        id: "action-mail",
        label: "M'écrire un e-mail",
        group: "Actions",
        icon: <IconMail size={16} />,
        keywords: ["contact", "mailto"],
        perform: () => {
          window.location.href = `mailto:${site.email}`;
        },
      },
    ];

    const themes: Command[] = (
      [
        { value: "light", label: "Thème clair", icon: <IconSun size={16} /> },
        { value: "dark", label: "Thème sombre", icon: <IconMoon size={16} /> },
        {
          value: "system",
          label: "Suivre le système",
          icon: <IconMonitor size={16} />,
        },
      ] as const
    ).map<Command>(({ value, label, icon }) => ({
      id: `theme-${value}`,
      label,
      group: "Thème",
      icon,
      hint: preference === value ? "Actif" : undefined,
      keywords: ["theme", "dark", "light", "apparence", "couleur"],
      keepOpen: true,
      perform: () => setPreference(value),
    }));

    const links: Command[] = [
      {
        id: "link-github",
        label: "GitHub",
        group: "Liens",
        icon: <IconGithub size={16} />,
        hint: "github.com/gabtoledano",
        perform: () => openExternal(site.github),
      },
      {
        id: "link-linkedin",
        label: "LinkedIn",
        group: "Liens",
        icon: <IconLinkedin size={16} />,
        hint: "in/gabrieltoledano",
        perform: () => openExternal(site.linkedin),
      },
    ];

    const all = [
      ...navigation,
      ...projectCommands,
      ...actions,
      ...themes,
      ...links,
    ];

    // Le nom du groupe devient un mot-clé implicite de chacune de ses entrées :
    // taper « proj » remonte les projets, « thème » tout le groupe Thème.
    // Les mots-clés étant notés en dessous des libellés, une correspondance
    // exacte de titre reste toujours en tête.
    return all.map((command) => ({
      ...command,
      keywords: [...(command.keywords ?? []), command.group],
    }));
  }, [preference, setPreference, copied, copy]);
}
