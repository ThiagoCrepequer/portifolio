export interface PersonalData {
  name: string
  title: string
  description: string
  about: {
    intro: string
    passion: string
    achievement: {
      title: string
      description: string
    }
  }
  contact: {
    email: string
    phone: string
    location: string
    github: string
    linkedin: string
  }
}

// Re-export i18n types for convenience
export type { 
  Achievement, 
  Experience, 
  Project, 
  TranslationResource 
} from './i18n';

export interface Technology {
  name: string
  iconUrl: string
  category: string
}

export interface TechnologiesData {
  main: Technology[]
  secondary: Technology[]
}
