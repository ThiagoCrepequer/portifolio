import { Code2 } from "lucide-react";
import { useTypedTranslation } from "../hooks/useTypedTranslation";

const About = () => {
  const { t, getAchievements } = useTypedTranslation();
  const achievements = getAchievements();

  return (
    <section id="sobre" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("about.title")}</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {t("personal.about.intro")}
            </p>

            <div className="space-y-4">
              {achievements.map((achievement, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
                  {index === 0 && (
                    <img
                      src="/images/medalha-eb.png"
                      alt="Achievement"
                      className="w-6"
                    />
                  )}
                  {index === 1 && (
                    <img
                      src="/icons/gcp.svg"
                      alt="Google Cloud"
                      className="w-6"
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
            <div className="w-80 h-80 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
              <Code2 className="h-32 w-32 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
