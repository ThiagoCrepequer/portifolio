import { useTranslation } from "@/hooks/useTranslation";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-8 border-t border-border bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase">
            &copy; 2025 {t("personal.name")}
          </p>
          <p className="font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase">
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};
