import { createServerFn } from "@tanstack/react-start";

export const getTecnologies = createServerFn().handler(() => {
  return {
    main: [
      { name: "Spring", iconKey: "spring", category: "Backend" },
      { name: "React", iconKey: "react", category: "Frontend" },
      { name: "PostgreSQL", iconKey: "postgresql", category: "Database" },
      { name: "Google Cloud", iconKey: "gcp", category: "Cloud" },
    ],
    secondary: [
      { name: "Java", iconKey: "java", category: "Backend" },
      { name: "Node.js", iconKey: "nodejs", category: "Backend" },
      { name: "TypeScript", iconKey: "typescript", category: "Language" },
      { name: "JavaScript", iconKey: "javascript", category: "Language" },
      { name: "Docker", iconKey: "docker", category: "DevOps" },
      { name: "Git", iconKey: "git", category: "Tools" },
      { name: "Linux", iconKey: "linux", category: "OS" },
      { name: "AWS", iconKey: "aws", category: "Cloud" },
      { name: "Cloudflare", iconKey: "cloudflare", category: "Cloud" },
      { name: "React Native", iconKey: "reactnative", category: "Mobile" },
      { name: "Gemini API", iconKey: "gemini", category: "AI" },
      { name: "OpenAI API", iconKey: "openai", category: "AI" },
    ],
  };
});
