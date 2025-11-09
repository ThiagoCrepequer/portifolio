import Contact from "@/components/Contact";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { getTecnologies } from "@/data/tecnologies";
import { useTranslation } from "@/hooks/useTranslation";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, ExternalLink, Github } from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    return {
      technologies: await getTecnologies(),
    };
  },
});

function App() {
  const { technologies } = Route.useLoaderData();
  const { t } = useTranslation();

  return (
    <>
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-lg text-gray-500 mb-2 font-medium tracking-wide">
            {t("personal.name").toUpperCase()}
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            {t("hero.title")}
            <span className="block text-gray-600">{t("hero.subtitle")}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("personal.description")}
          </p>
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

      <section id="sobre" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t("about.title")}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t("personal.about.intro")}
              </p>

              <div className="space-y-4">
                {t("personal.about.achievements", {
                  returnObjects: true,
                }).map((achievement, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200"
                  >
                    {index === 0 && (
                      <div className="w-12 flex justify-center items-center">
                        <img
                          src="/images/medalha-eb.png"
                          alt="Achievement"
                          className="w-6"
                        />
                      </div>
                    )}
                    {index === 1 && (
                      <img
                        src="/images/cloud-computing.png"
                        alt="Google Cloud"
                        className="w-12"
                      />
                    )}
                    {index === 2 && (
                      <img
                        src="/images/cloud-cybersecurity.png"
                        alt="Google Cloud"
                        className="w-12"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="w-80 h-80 mx-auto rounded-full flex items-center justify-center ">
                <img
                  className="w-80 h-80 rounded-full object-cover border-4 border-gray-200"
                  src="/images/me.webp"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tecnologias" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("technologies.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("technologies.subtitle")}
            </p>
          </div>

          {/* Main Technologies */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Stack Principal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {technologies.main.map((tech, index) => (
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
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {t(`technologies.categories.${tech.category}`)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Secondary Technologies */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Outras Tecnologias
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-6">
              {technologies.secondary.map((tech, index) => (
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
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-10 h-10 mx-auto bg-gray-200 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">${tech.name.charAt(0)}</div>`;
                          }
                        }}
                      />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">
                      {tech.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {t(`technologies.categories.${tech.category}`)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Categories Legend */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-4">
              {Array.from(
                new Set(
                  [...technologies.main, ...technologies.secondary].map(
                    (tech) => tech.category
                  )
                )
              ).map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {t(`technologies.categories.${category}`)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="experiencias" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("experience.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("experience.subtitle")}
            </p>
          </div>

          <div className="space-y-8">
            {t("experiences", { returnObjects: true }).map((exp, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        className="w-8 mb-2 md:mb-0"
                      />
                      <div>
                        <CardTitle className="text-xl text-gray-900">
                          {exp.title}
                        </CardTitle>
                        <CardDescription className="text-lg font-medium text-gray-700 mt-1">
                          {exp.company}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-2 md:mt-0 w-fit">
                      <Calendar className="h-4 w-4 mr-1" />
                      {exp.period}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {exp.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-center mt-10">
          <a
            href={t("personal.contact.linkedin")}
            title={t("experience.viewMore")}
            className="text-md text-gray-400 hover:text-gray-600 transition-colors"
          >
            {t("experience.viewMore")}
          </a>
        </div>
      </section>

      <section id="projetos" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("projects.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("projects.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t("projectsList", { returnObjects: true }).map(
              (project, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow group h-full flex flex-col"
                >
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-gray-700 transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col grow justify-end">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map(
                        (tech: string, techIndex: number) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        )
                      )}
                    </div>
                    <div className="flex space-x-3">
                      {project.github && (
                        <Button variant="outline" size="sm">
                          <a
                            href={project.github}
                            className="flex items-center"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4 mr-1" />
                            {t("projects.buttons.github")}
                          </a>
                        </Button>
                      )}
                      <Button size="sm">
                        <a
                          href={project.demo}
                          className="flex items-center"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {t("projects.buttons.demo")}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}
