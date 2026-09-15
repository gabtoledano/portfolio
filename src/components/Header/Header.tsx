import { useCallback, useRef, useState, type MouseEvent } from "react";
import { SECTIONS, SECTION_IDS } from "@/data/site";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useEventListener } from "@/hooks/useEventListener";
import { useHotkey } from "@/hooks/useHotkey";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { scrollToSection } from "@/lib/scrollToSection";
import CommandTrigger from "@/components/ui/CommandTrigger";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ThemeToggle from "@/components/ui/ThemeToggle";
import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const activeId = useScrollSpy(SECTION_IDS);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // `setState` avec la même valeur ne déclenche pas de rendu : l'écouteur peut
  // donc rester bruyant sans coûter quoi que ce soit.
  useEventListener("scroll", () => setScrolled(window.scrollY > 8), {
    passive: true,
  });

  useHotkey("escape", closeMenu, { enabled: menuOpen });
  useLockBodyScroll(menuOpen && isMobile);
  useFocusTrap(menuOpen && isMobile, navRef);

  // Hors ouverture, le menu mobile est visuellement sorti de l'écran mais
  // resterait tabulable : `inert` le retire aussi du parcours clavier et de
  // l'arbre d'accessibilité.
  const navInert = isMobile && !menuOpen;

  const handleNavClick = (id: string) => (event: MouseEvent) => {
    event.preventDefault();
    closeMenu();
    scrollToSection(id);
  };

  return (
    <header className={styles.header} data-scrolled={scrolled}>
      <div className={styles.inner}>
        <a
          href="#top"
          className={styles.logo}
          onClick={handleNavClick("top")}
          aria-label="Gabriel Toledano — retour en haut"
        >
          GT
        </a>

        <nav
          id="main-navigation"
          ref={navRef}
          inert={navInert}
          aria-label="Navigation principale"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
        >
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={handleNavClick(section.id)}
              aria-current={activeId === section.id ? "true" : undefined}
              className={styles.navLink}
            >
              <span className={styles.navIndex} aria-hidden="true">
                {section.index}.
              </span>
              {section.label}
            </a>
          ))}

          <a
            href="#contact"
            onClick={handleNavClick("contact")}
            className={styles.ctaMobile}
          >
            Me contacter
          </a>
        </nav>

        <div className={styles.tools}>
          <CommandTrigger />
          <ThemeToggle />
          <a
            href="#contact"
            onClick={handleNavClick("contact")}
            className={styles.cta}
          >
            Me contacter
          </a>

          <button
            type="button"
            className={styles.burger}
            data-open={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>
        </div>
      </div>

      <ScrollProgress />
    </header>
  );
}
