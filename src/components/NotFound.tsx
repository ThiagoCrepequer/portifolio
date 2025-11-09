import { useTranslation } from "@/hooks/useTranslation";

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-screen py-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        {t("notFound.title")}
      </h1>
      <p className="text-xl text-gray-600 mb-8">{t("notFound.description")}</p>
      <a
        href="/"
        className="px-6 py-3 text-black rounded-lg underline"
      >
        {t("notFound.backHome")}
      </a>
    </div>
  );
};
