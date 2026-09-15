/**
 * Amène une section dans le viewport. `scroll-padding-top` est défini sur
 * `<html>`, la compensation du header fixe est donc automatique.
 */
export function scrollToSection(id: string): void {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
