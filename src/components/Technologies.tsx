import { useTranslation } from "react-i18next"
import { Card, CardContent } from "./ui/Card"
import technologiesData from "../data/technologies.json"
import type { TechnologiesData } from "../types"

const typedTechnologies = technologiesData as TechnologiesData

const Technologies = () => {
  const { t } = useTranslation()

  return (
    <section id="tecnologias" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("technologies.title")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("technologies.subtitle")}
          </p>
        </div>

        {/* Main Technologies */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Stack Principal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {typedTechnologies.main.map((tech, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 group border-2 hover:border-gray-300"
              >
                <CardContent>
                  <div className="my-4 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={tech.iconUrl || "/placeholder.svg"}
                      alt={`${tech.name} icon`}
                      className="w-14 h-14 mx-auto"
                      onError={(e) => {
                        // Fallback para caso o ícone não carregue
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<div class="w-16 h-16 mx-auto bg-gray-200 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-600">${tech.name.charAt(0)}</div>`
                        }
                      }}
                    />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{tech.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">{t(`technologies.categories.${tech.category}`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Secondary Technologies */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Outras Tecnologias</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {typedTechnologies.secondary.map((tech, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="p-4">
                  <div className="my-3 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={tech.iconUrl || "/placeholder.svg"}
                      alt={`${tech.name} icon`}
                      className="w-10 h-10 mx-auto"
                      onError={(e) => {
                        // Fallback para caso o ícone não carregue
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<div class="w-10 h-10 mx-auto bg-gray-200 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">${tech.name.charAt(0)}</div>`
                        }
                      }}
                    />
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">{tech.name}</h4>
                  <p className="text-xs text-gray-500">{t(`technologies.categories.${tech.category}`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories Legend */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from(
              new Set([...typedTechnologies.main, ...typedTechnologies.secondary].map((tech) => tech.category)),
            ).map((category) => (
              <span key={category} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {t(`technologies.categories.${category}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Technologies
