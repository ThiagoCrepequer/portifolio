import { useTranslation } from 'react-i18next';
import { Achievement, Experience, Project } from '../types/i18n';

export const useTypedTranslation = () => {
  const { t, i18n } = useTranslation();

  const getAchievements = (): Achievement[] => {
    return t("personal.about.achievements", { returnObjects: true }) as Achievement[];
  };

  const getExperiences = (): Experience[] => {
    return t("experiences", { returnObjects: true }) as Experience[];
  };

  const getProjects = (): Project[] => {
    return t("projectsList", { returnObjects: true }) as Project[];
  };

  return {
    t,
    i18n,
    getAchievements,
    getExperiences,
    getProjects,
  };
};
