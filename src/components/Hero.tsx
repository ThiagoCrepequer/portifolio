import { useTranslation } from "react-i18next"
import Button from "./ui/Button"

const Hero = () => {
  const { t } = useTranslation()

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <div className="text-lg text-gray-500 mb-2 font-medium tracking-wide">
          {t("personal.name").toUpperCase()}
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
          {t("hero.title")}
          <span className="block text-gray-600">{t("hero.subtitle")}</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{t("personal.description")}</p>
        <div className="flex justify-center space-x-4">
          <Button size="lg">
            <a href="#contato">{t("hero.cta.contact")}</a>
          </Button>
          <Button variant="outline" size="lg">
            <a href="#projetos">{t("hero.cta.projects")}</a>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero
