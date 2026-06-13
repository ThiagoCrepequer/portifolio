import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { I18nextProvider } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import appCss from "../styles.css?url";
import i18n from "../i18n/config";
import { getT } from "@/lib/i18nServer";
import { useTranslation } from "@/hooks/useTranslation";
import { useDocumentLang } from "@/hooks/useDocumentLang";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NotFound } from "@/components/NotFound";
import { SkipLink } from "@/components/SkipLink";
import { RouteError } from "@/components/RouteError";

function getOgLocale(locale: string): string {
  if (locale === "pt") return "pt_BR";
  if (locale === "en") return "en_US";
  if (locale === "es") return "es_ES";
  return "pt_BR";
}

export const Route = createRootRoute({
  head: () => {
    const locale = i18n.language || "pt";
    const t = getT(locale);
    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: `Thiago Crepequer - ${t("personal.title")}`,
        },
        {
          name: "description",
          content: t("seo.description"),
        },
        {
          name: "keywords",
          content: t("seo.keywords"),
        },
        {
          property: "og:site_name",
          content: "Thiago Crepequer",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:locale",
          content: getOgLocale(locale),
        },
        {
          property: "og:title",
          content: t("seo.ogTitle"),
        },
        {
          property: "og:description",
          content: t("seo.ogDescription"),
        },
        {
          property: "og:image",
          content: "/og-image.jpg",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: t("seo.ogTitle"),
        },
        {
          name: "twitter:description",
          content: t("seo.ogDescription"),
        },
        {
          name: "twitter:image",
          content: "/og-image.jpg",
        },
        {
          name: "theme-color",
          content: "#170d02",
        },
      ],
      links: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Courier+Prime:wght@400;700&display=swap",
        },
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "manifest",
          href: "/manifest.json",
        },
        {
          rel: "icon",
          href: "/favicon.ico",
        },
      ],
    };
  },
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: RouteError,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  useTranslation();
  useDocumentLang();

  return (
    <html lang={i18n.language || "pt"} className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="dark bg-background text-foreground antialiased">
        <SkipLink />
        <I18nextProvider i18n={i18n}>
          <Header />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
        </I18nextProvider>
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </body>
    </html>
  );
}
