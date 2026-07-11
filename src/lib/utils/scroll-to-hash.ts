export function getHashFromHref(href: string): string | null {
  if (href.startsWith("#")) {
    return href.slice(1) || null;
  }

  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;
  return href.slice(hashIndex + 1) || null;
}

export function scrollToHash(
  href: string,
  behavior: ScrollBehavior = "smooth",
): boolean {
  const hash = getHashFromHref(href);
  if (!hash) return false;

  const target = document.getElementById(hash);
  if (!target) return false;

  target.scrollIntoView({ behavior, block: "start" });

  const nextUrl = href.startsWith("/") ? href : `/#${hash}`;
  window.history.pushState(null, "", nextUrl);

  return true;
}
