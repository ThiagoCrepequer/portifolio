import { ExternalLink, Github } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import { useTypedTranslation } from "../hooks/useTypedTranslation";

const Projects = () => {
  const { t, getProjects } = useTypedTranslation();
  const projects = getProjects();

  return (
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
          {projects.map((project, index) => (
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
              <CardContent className="flex flex-col flex-grow justify-end">
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
