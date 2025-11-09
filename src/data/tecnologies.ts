import { createServerFn } from "@tanstack/react-start";

export const getTecnologies = createServerFn().handler(() => {
  return {
    main: [
      { name: "Spring", iconUrl: "/icons/spring.svg", category: "Backend" },
      { name: "React", iconUrl: "/icons/react.svg", category: "Frontend" },
      {
        name: "PostgreSQL",
        iconUrl: "/icons/postgresql.svg",
        category: "Database",
      },
      { name: "Google Cloud", iconUrl: "/icons/gcp.svg", category: "Cloud" },
    ],
    secondary: [
      { name: "Java", iconUrl: "/icons/java.svg", category: "Backend" },
      { name: "Node.js", iconUrl: "/icons/nodejs.svg", category: "Backend" },
      {
        name: "TypeScript",
        iconUrl: "/icons/typescript.svg",
        category: "Language",
      },
      {
        name: "JavaScript",
        iconUrl: "/icons/javascript.svg",
        category: "Language",
      },
      { name: "Docker", iconUrl: "/icons/docker.svg", category: "DevOps" },
      { name: "Git", iconUrl: "/icons/git.svg", category: "Tools" },
      { name: "Linux", iconUrl: "/icons/linux.svg", category: "OS" },
      { name: "AWS", iconUrl: "/icons/aws.svg", category: "Cloud" },
      {
        name: "Cloudflare",
        iconUrl: "/icons/cloudflare.svg",
        category: "Cloud",
      },
      { name: "React Native", iconUrl: "/icons/react.svg", category: "Mobile" },
      { name: "Gemini API", iconUrl: "/icons/gemini.svg", category: "AI" },
      { name: "OpenAI API", iconUrl: "/icons/openai.svg", category: "AI" },
    ],
  };
});
