import { useTranslation } from "@/hooks/useTranslation";

export const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="py-8 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-600">
          <p>
            &copy; 2025 {t("personal.name")} - {t("personal.title")}.{" "}
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};
