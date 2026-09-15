/// <reference types="vite/client" />

/**
 * Typage explicite des variables d'environnement.
 *
 * Sans ça, `import.meta.env.VITE_TYPO` passe la compilation et échoue en
 * production ; ici une clé inconnue est une erreur TypeScript. Elles sont
 * optionnelles : le formulaire doit savoir se comporter quand la configuration
 * EmailJS est absente (fork du dépôt, environnement de préversion…).
 */
interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
