import { withBase } from "@kamod-ch/brand";
import { useEffect } from "preact/hooks";

const THEME_STORAGE_KEY = "preactpress-theme";

function readStoredTheme(): "light" | "dark" | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function isDarkMode(): boolean {
  const root = document.documentElement;
  const stored = readStoredTheme();
  if (stored === "dark") return true;
  if (stored === "light") return false;
  if (root.getAttribute("data-theme") === "dark" || root.classList.contains("dark")) return true;
  if (root.getAttribute("data-theme") === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function syncFavicon(base: string): void {
  const href = withBase(base, isDarkMode() ? "favicon-dark.svg" : "favicon-light.svg");

  if (readStoredTheme()) {
    document.querySelectorAll('link[rel="icon"][media]').forEach((node) => node.remove());
  }

  for (const selector of ['link[rel="icon"]:not([media])', 'link[rel="apple-touch-icon"]']) {
    const link = document.querySelector<HTMLLinkElement>(selector);
    if (link) link.href = href;
  }
}

export default function FaviconSync({ base }: { base: string }) {
  useEffect(() => {
    syncFavicon(base);

    const observer = new MutationObserver(() => syncFavicon(base));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) syncFavicon(base);
    };
    window.addEventListener("storage", onStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", onStorage);
    };
  }, [base]);

  return null;
}
