import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Projects from "./components/Projects/Projects";
import Skills from "./components/Skills/Skills";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { CommandProvider } from "./providers/CommandProvider";
import { ThemeProvider } from "./providers/ThemeProvider";

/**
 * Composition de l'application.
 *
 * L'ordre des fournisseurs compte : `ErrorBoundary` est le plus extérieur pour
 * pouvoir rattraper une erreur venue de n'importe où, et `CommandProvider` est
 * à l'intérieur de `ThemeProvider` puisque la palette propose de changer de
 * thème.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CommandProvider>
          <a href="#contenu" className="skipLink">
            Aller au contenu
          </a>

          <Header />

          <main id="contenu">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>

          <Footer />
        </CommandProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
