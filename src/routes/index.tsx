import Contact from "@/components/EmailContact";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getTecnologies } from "@/data/tecnologies";
import { useTranslation } from "@/hooks/useTranslation";
import { createFileRoute } from "@tanstack/react-router";
import i18n from "@/i18n/config";
import { getT } from "@/lib/i18nServer";
import {
  ArrowRight,
  Calendar,
  ExternalLink,
  Github,
  MapPin,
  Briefcase,
  Cpu,
  Layers,
  Award,
  Cloud,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";
import {
  SiSpring,
  SiReact,
  SiPostgresql,
  SiGooglecloud,
  SiOpenjdk,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
  SiDocker,
  SiGit,
  SiLinux,
  SiCloudflare,
  SiOpenai,
} from "react-icons/si";
import { FaAws, FaGem } from "react-icons/fa";
import { TerminalWindow } from "@/components/hermes/TerminalWindow";
import { SectionHeader } from "@/components/hermes/SectionHeader";
import { GridCard } from "@/components/hermes/GridCard";
import { StatusBadge } from "@/components/hermes/StatusBadge";
import { GlowBackground } from "@/components/hermes/GlowBackground";
import type { IconType } from "react-icons";

export const Route = createFileRoute("/")({
  component: App,
  head: () => {
    const locale = i18n.language || "pt";
    const t = getT(locale);
    const ogLocale = locale === "pt" ? "pt_BR" : locale === "en" ? "en_US" : "es_ES";
    const sameAs = t("person.sameAs", { returnObjects: true }) as unknown as string[];
    const knowsAbout = t("person.knowsAbout", { returnObjects: true }) as unknown as string[];

    return {
      meta: [
        { title: t("seo.title") },
        { name: "description", content: t("seo.description") },
        { name: "keywords", content: t("seo.keywords") },
        { property: "og:type", content: "website" },
        { property: "og:title", content: t("seo.ogTitle") },
        { property: "og:description", content: t("seo.ogDescription") },
        { property: "og:locale", content: ogLocale },
        { property: "og:site_name", content: "Thiago Crepequer" },
        { property: "og:image", content: "/og-image.jpg" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: t("seo.ogTitle") },
        { name: "twitter:description", content: t("seo.ogDescription") },
        { name: "twitter:image", content: "/og-image.jpg" },
      ],
      links: [
        { rel: "canonical", href: "https://crepequer.dev/" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: t("person.name"),
            jobTitle: t("person.jobTitle"),
            url: t("person.url"),
            sameAs,
            knowsAbout,
          }),
        },
      ],
    };
  },
  loader: async () => {
    return {
      technologies: await getTecnologies(),
    };
  },
});

function App() {
  const { technologies } = Route.useLoaderData();
  const { t } = useTranslation();

  const achievements = t("personal.about.achievements", {
    returnObjects: true,
  }) as unknown as Array<{ title: string; description: string; icon: string }>;

  const achievementIcons: Record<string, LucideIcon> = {
    award: Award,
    cloud: Cloud,
    shield: ShieldCheck,
  };

  const techIconMap: Record<string, IconType> = {
    spring: SiSpring,
    react: SiReact,
    postgresql: SiPostgresql,
    gcp: SiGooglecloud,
    java: SiOpenjdk,
    nodejs: SiNodedotjs,
    typescript: SiTypescript,
    javascript: SiJavascript,
    docker: SiDocker,
    git: SiGit,
    linux: SiLinux,
    aws: FaAws,
    cloudflare: SiCloudflare,
    reactnative: SiReact,
    gemini: FaGem,
    openai: SiOpenai,
  };

  type ExperienceRole = {
    title: string;
    period: string;
    description: string;
  };

  type Experience =
    | {
        company: string;
        logo: string;
        type: "timeline";
        roles: ExperienceRole[];
      }
    | {
        company: string;
        logo: string;
        type: "single";
        title: string;
        period: string;
        description: string;
      };

  const experiences = t("experiences", { returnObjects: true }) as unknown as Experience[];

  const projects = t("projectsList", { returnObjects: true }) as unknown as Array<{
    title: string;
    description: string;
    technologies: string[];
    github?: string;
    demo?: string;
  }>;

  const processSteps = t("process.steps", {
    returnObjects: true,
  }) as unknown as Array<{ title: string; description: string }>;

  const stats = [
    { label: t("stats.labels.experience"), value: t("stats.experience"), icon: Briefcase },
    { label: t("stats.labels.location"), value: t("stats.location"), icon: MapPin },
    { label: t("stats.labels.availability"), value: t("stats.availability"), icon: Cpu },
    { label: t("stats.labels.focus"), value: t("stats.focus"), icon: Layers },
  ];

  return (
    <>
      <GlowBackground />

      {/* HERO */}
      <section className="relative min-h-[92dvh] flex flex-col justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative z-10 max-w-[1600px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border bg-[rgba(255,172,2,0.06)] mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-midground opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-midground" />
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-midground">
                  {t("hero.status")}
                </span>
              </div>

              <p className="font-mono text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">
                {t("personal.name")}
              </p>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[9rem] font-bold text-foreground leading-[0.9] tracking-tight mb-8">
                {t("hero.title")}
                <span className="block text-midground">{t("hero.subtitle")}</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
                {t("hero.tagline")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="rounded-none bg-midground text-primary-foreground hover:bg-midground/90 font-mono text-xs tracking-[0.15em] uppercase px-8 h-12"
                  asChild
                >
                  <a href="#contato">
                    {t("hero.cta.contact")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-none border-border text-foreground hover:border-midground hover:bg-midground/10 font-mono text-xs tracking-[0.15em] uppercase px-8 h-12"
                  asChild
                >
                  <a href="#projetos">{t("hero.cta.projects")}</a>
                </Button>
              </div>
            </div>

            <TerminalWindow title={t("terminal.title")} className="lg:translate-y-8">
              <span className="text-midground">$</span> {t("terminal.whoami")}
              <br />
              <span className="text-foreground">{t("personal.name")}</span>
              <br />
              <br />
              <span className="text-midground">$</span> {t("terminal.roleFile")}
              <br />
              <span className="text-foreground">{t("personal.title")}</span>
              <br />
              <br />
              <span className="text-midground">$</span> {t("terminal.skillsDir")}
              <br />
              <span className="text-accent">java</span> <span className="text-accent">spring</span>{" "}
              <span className="text-accent">react</span>{" "}
              <span className="text-accent">react-native</span>{" "}
              <span className="text-accent">postgresql</span>{" "}
              <span className="text-accent">aws</span> <span className="text-accent">docker</span>
              <br />
              <br />
              <span className="text-midground">$</span> {t("terminal.uptime")}
              <br />
              <span className="text-muted-foreground">
                {t("stats.experience")} • {t("stats.location")}
              </span>
              <br />
              <br />
              <span className="text-midground">$</span> {t("terminal.contactCommand")}
              <br />
              <span className="text-muted-foreground">{t("terminal.redirecting")}</span>
              <span className="inline-block w-[0.6em] h-[1.1em] bg-midground ml-1 align-text-bottom blink" />
            </TerminalWindow>
          </div>

          {/* Status bar */}
          <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-border">
            {stats.map((stat, index) => (
              <StatusBadge key={index} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="sobre" className="py-24 md:py-32 border-t border-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label={t("about.label")}
            title={t("about.headline")}
            description={t("about.intro")}
          />

          <div className="grid md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievementIcons[achievement.icon] || Award;
              return (
                <GridCard key={index}>
                  <div className="flex items-start justify-between mb-6">
                    <span className="font-mono text-xs tracking-[0.2em] uppercase text-midground">
                      0{index + 1}
                    </span>
                    <div className="w-11 h-11 border border-border bg-[rgba(255,172,2,0.06)] flex items-center justify-center">
                      <Icon className="h-5 w-5 text-midground" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {achievement.description}
                  </p>
                </GridCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("process.title")} title={t("process.subtitle")} />

          <div className="grid md:grid-cols-3 gap-0 border border-border">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`p-8 md:p-10 ${
                  index !== 2
                    ? "border-b md:border-b-0 md:border-r border-border"
                    : ""
                } hover:bg-[rgba(255,172,2,0.04)] transition-colors group`}
              >
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-midground transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section id="tecnologias" className="py-24 md:py-32 border-t border-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("technologies.label")} title={t("technologies.subtitle")} />

          <div className="mb-12">
            <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
              {t("technologies.mainLabel")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 border border-border">
              {technologies.main.map((tech, index) => {
                const Icon = techIconMap[tech.iconKey];
                return (
                  <div
                    key={index}
                    className="group p-6 md:p-8 flex flex-col items-center text-center border-b md:border-b-0 border-border last:border-b-0 md:[&:not(:last-child)]:border-r hover:bg-[rgba(255,172,2,0.04)] transition-colors"
                  >
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      {Icon ? (
                        <Icon className="w-12 h-12 mx-auto text-midground" aria-label={tech.name} />
                      ) : (
                        <div className="w-12 h-12 mx-auto border border-border flex items-center justify-center font-mono text-lg text-midground">
                          {tech.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{tech.name}</h4>
                    <p className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
                      {t(`technologies.categories.${tech.category}`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
              {t("technologies.secondaryLabel")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 border border-border">
              {technologies.secondary.map((tech, index) => {
                const Icon = techIconMap[tech.iconKey];
                return (
                  <div
                    key={index}
                    className="group p-5 flex flex-col items-center text-center border-b border-r border-border hover:bg-[rgba(255,172,2,0.04)] transition-colors"
                  >
                    <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                      {Icon ? (
                        <Icon className="w-9 h-9 mx-auto text-midground" aria-label={tech.name} />
                      ) : (
                        <div className="w-9 h-9 mx-auto border border-border flex items-center justify-center font-mono text-xs text-midground">
                          {tech.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-sm text-foreground mb-0.5">{tech.name}</h4>
                    <p className="font-mono text-[9px] tracking-wider uppercase text-muted-foreground">
                      {t(`technologies.categories.${tech.category}`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experiencias" className="py-24 md:py-32 border-t border-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("experience.label")} title={t("experience.title")} />

          <div className="space-y-0 border border-border">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="group p-6 md:p-8 border-b border-border last:border-b-0 hover:bg-[rgba(255,172,2,0.04)] transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex items-start space-x-5 w-full">
                    <div className="w-14 h-14 shrink-0 border border-border bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
                      <img
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        width={36}
                        height={36}
                        loading="lazy"
                        decoding="async"
                        className="w-9 h-9 object-contain icon-hermes-bright icon-hover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm tracking-wider uppercase text-midground mb-3">
                        {exp.company}
                      </p>

                      {exp.type === "timeline" ? (
                        <div className="relative pl-6 border-l border-border space-y-8 w-full">
                          {exp.roles.map((role, roleIndex) => (
                            <div key={roleIndex} className="relative">
                              <span className="absolute -left-[29px] top-1.5 w-3 h-3 border border-midground bg-background" />
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-midground transition-colors">
                                  {role.title}
                                </h3>
                                <Badge variant="outline" className="w-fit shrink-0">
                                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                  {role.period}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground leading-relaxed max-w-3xl">
                                {role.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-1 group-hover:text-midground transition-colors">
                            {exp.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed max-w-3xl mt-3">
                            {exp.description}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {exp.type === "single" && (
                    <Badge variant="outline" className="w-fit shrink-0">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      {exp.period}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href={t("personal.contact.linkedin")}
              title={t("experience.viewMore")}
              className="inline-flex items-center font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-midground transition-colors"
            >
              {t("experience.viewMore")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projetos" className="py-24 md:py-32 border-t border-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("projects.label")} title={t("projects.subtitle")} />

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group border border-border bg-background hover:border-midground transition-colors p-8 flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-midground transition-colors">
                    {project.title}
                  </h3>
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                  {project.description}
                </p>

                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-[10px]">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {project.github && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none border-border hover:border-midground hover:bg-midground hover:text-primary-foreground font-mono text-xs tracking-wider uppercase"
                        asChild
                      >
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <Github className="h-4 w-4 mr-1.5" />
                          {t("projects.buttons.github")}
                        </a>
                      </Button>
                    )}
                    {project.demo && (
                      <Button
                        size="sm"
                        className="rounded-none bg-midground text-primary-foreground hover:bg-midground/90 font-mono text-xs tracking-wider uppercase"
                        asChild
                      >
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-1.5" />
                          {t("projects.buttons.demo")}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}
