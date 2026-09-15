import { Component, type ErrorInfo, type ReactNode } from "react";
import styles from "./ErrorBoundary.module.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Filet de sécurité de l'application.
 *
 * React n'expose toujours pas d'équivalent en hook : la capture d'erreur de
 * rendu passe obligatoirement par une classe. Sans elle, la moindre exception
 * dans un composant démonte tout l'arbre et laisse une page blanche ; ici
 * l'utilisateur garde un message et un moyen de repartir.
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // En production, c'est ici que partirait le rapport vers Sentry.
    console.error("Erreur de rendu interceptée :", error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ error: null });
  };

  override render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className={styles.fallback} role="alert">
        <p className={styles.code}>500 — quelque chose a cassé</p>
        <h1 className={styles.title}>Cette page a rencontré une erreur.</h1>
        <p className={styles.message}>
          Rien n'est perdu de votre côté. Vous pouvez réessayer, ou m'écrire
          directement si le problème persiste.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            onClick={this.handleReset}
          >
            Réessayer
          </button>
          <a className={styles.secondary} href="mailto:gabrieltoledano19@gmail.com">
            Me signaler le bug
          </a>
        </div>
      </div>
    );
  }
}
