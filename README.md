# Portfolio — Gabriel Toledano

Portfolio personnel d'un développeur front-end junior, ex-graphiste.
Application React monopage, écrite en TypeScript strict et servie par Vite.

**En ligne :** [gabrieltoledano.dev](https://www.gabrieltoledano.dev/)

---

## Stack

| Domaine       | Choix                                                     |
| ------------- | --------------------------------------------------------- |
| Interface     | React 19 (`use`, contexte comme composant, `useId`)        |
| Langage       | TypeScript en mode `strict` + `noUncheckedIndexedAccess`   |
| Build         | Vite 8                                                     |
| Styles        | CSS Modules, variables CSS, zéro dépendance UI             |
| Tests         | Vitest + Testing Library (jsdom)                           |
| Qualité       | Oxlint                                                     |
| Formulaire    | EmailJS                                                    |

Aucune librairie de composants, d'animation ou de gestion d'état : tout est
écrit à la main, c'est le sujet du portfolio.

## Démarrer

```bash
npm install
npm run dev
```

| Script               | Effet                                        |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Serveur de développement                     |
| `npm run build`      | Vérification des types puis build production  |
| `npm run test`       | Suite de tests                                |
| `npm run test:watch` | Tests en continu                              |
| `npm run lint`       | Analyse statique                              |
| `npm run preview`    | Prévisualisation du build                     |

### Variables d'environnement

Le formulaire de contact utilise EmailJS. Sans ces trois clés, le site
fonctionne normalement et le formulaire propose un lien `mailto:` de repli.

```bash
# .env.local
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

Elles sont typées dans `src/vite-env.d.ts` : une clé mal orthographiée est une
erreur de compilation, pas une surprise en production.

## Organisation

```
src/
├── components/
│   ├── CommandPalette/   Palette ⌘K (portail, recherche floue, clavier)
│   ├── Icons/            Icônes SVG inline, bâties sur une enveloppe commune
│   ├── ui/               Primitives réutilisables (Section, Reveal, CodeWindow…)
│   └── …                 Une section du site par dossier
├── data/                 Contenu : projets, compétences, sections, liens
├── hooks/                Hooks maison, un fichier par hook
├── lib/                  Logique pure et testable (recherche floue, tokens)
├── providers/            Contextes thème et palette de commandes
├── styles/               Tokens de design et conteneur partagé
└── types/                Types partagés
```

## Points techniques

**Palette de commandes (⌘K ou `/`).** Rendue dans un portail, chargée à la
demande via `lazy` + `Suspense` (chunk séparé de ~3 ko gzip). Recherche floue
par sous-séquence avec repli des accents, filtrage passé en `useDeferredValue`,
navigation clavier sur une liste aplatie indépendante du regroupement visuel,
et motif « combobox » du WAI-ARIA avec `aria-activedescendant`.

**Thème clair / sombre / système.** Un contexte, une préférence persistée via
`useSyncExternalStore` (synchronisée entre les onglets), un seul attribut
`data-theme` sur `<html>` que toute la feuille de style écoute. Un script inline
dans `index.html` applique le thème avant le premier rendu pour éviter le flash.

**Formulaire de contact.** `useReducer` sur une union discriminée
`idle | submitting | success | error` : les états impossibles ne sont pas
représentables. Validation par champ, erreurs affichées seulement après le
premier abandon du champ, `aria-invalid` / `aria-describedby` reliés, focus
renvoyé sur le premier champ fautif.

**Animations sans re-rendu.** Barre de progression de lecture et halo qui suit
le curseur écrivent dans des variables CSS depuis une ref, cadencés par
`requestAnimationFrame`. Aucun de ces deux composants ne rend plus d'une fois.

**Accessibilité.** Lien d'évitement, piège à focus sur les surfaces modales,
menu mobile marqué `inert` à la fermeture, navigation au clavier de bout en
bout, et `prefers-reduced-motion` respecté en CSS comme en JavaScript.

## Tests

```bash
npm run test
```

La suite couvre la logique pure (moteur de recherche floue, découpe des tokens
de code, réducteur du formulaire) et un parcours d'intégration complet de la
palette : frappe au clavier → contexte thème → attribut du document.
