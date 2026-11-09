/**
 * Amène une section dans le viewport, juste sous le header fixe.
 *
 * La position est calculée avec `offsetTop`, qui ignore les transformations
 * CSS : un bloc encore décalé par son animation d'apparition (`<Reveal>`) est
 * visé à sa position finale, pas 24 px plus bas. Le décalage du header est lu
 * dans `scroll-padding-top`, défini sur `<html>`.
 */
export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth"): void {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const element = document.getElementById(id);
  if (!element) return;

  let top = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop;
  }

  const headerOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  window.scrollTo({ top: top - headerOffset, behavior });
}
