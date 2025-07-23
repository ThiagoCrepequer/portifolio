import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import Badge from "./ui/Badge";
import { useTypedTranslation } from "../hooks/useTypedTranslation";

const ExperienceSection = () => {
  const { t, getExperiences } = useTypedTranslation();
  const experiences = getExperiences();

  return (
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
          {experiences.map((exp, index) => (
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
  );
};

export default ExperienceSection;
