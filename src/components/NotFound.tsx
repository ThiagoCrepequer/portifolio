import { useTranslation } from "@/hooks/useTranslation";
import { Link } from "@tanstack/react-router";

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-screen py-20">
      <h1 className="text-2xl font-bold text-foreground mb-4">{t("notFound.title")}</h1>
      <p className="text-xl text-muted-foreground mb-8">{t("notFound.description")}</p>
      <Link to="/" className="px-6 py-3 text-midground hover:text-accent rounded-lg underline">
        {t("notFound.backHome")}
      </Link>
    </div>
  );
};
