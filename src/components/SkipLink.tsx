import { useTranslation } from "@/hooks/useTranslation";

export function SkipLink() {
  const { t } = useTranslation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("main-content");
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:p-3 focus-visible:bg-background focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-midground focus-visible:outline-none focus-visible:rounded focus-visible:shadow-lg focus-visible:font-mono focus-visible:text-sm focus-visible:tracking-wider"
    >
      {t("a11y.skipToContent")}
    </a>
  );
}
