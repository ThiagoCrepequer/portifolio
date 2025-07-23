export interface Achievement {
  title: string;
  description: string;
}

export interface Experience {
  title: string;
  company: string;
  logo: string;
  period: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  github: string;
  demo: string;
}

export interface TranslationResource {
  header: {
    brand: string;
    nav: {
      about: string;
      technologies: string;
      experience: string;
      projects: string;
      contact: string;
    };
  };
  hero: {
    title: string;
    subtitle: string;
    cta: {
      contact: string;
      projects: string;
    };
  };
  about: {
    title: string;
  };
  technologies: {
    title: string;
    subtitle: string;
    categories: {
      Backend: string;
      Frontend: string;
      Database: string;
      Cloud: string;
      Language: string;
      DevOps: string;
      Tools: string;
      OS: string;
      Mobile: string;
      AI: string;
    };
  };
  experience: {
    title: string;
    subtitle: string;
    viewMore: string;
  };
  projects: {
    title: string;
    subtitle: string;
    buttons: {
      github: string;
      demo: string;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      message: string;
      send: string;
      sending: string;
      success: string;
      error: string;
    };
    info: {
      email: string;
      phone: string;
      location: string;
    };
  };
  footer: {
    rights: string;
  };
  personal: {
    name: string;
    title: string;
    description: string;
    about: {
      intro: string;
      achievements: Achievement[];
    };
    contact: {
      email: string;
      location: string;
      github: string;
      linkedin: string;
    };
  };
  experiences: Experience[];
  projectsList: Project[];
}
