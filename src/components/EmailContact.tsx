import { FormEvent, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Github, Linkedin, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { SectionHeader } from "./hermes/SectionHeader";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const Contact = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error("EmailJS env vars missing");
      setStatus("error");
      return;
    }

    if (!formRef.current) return;

    setLoading(true);
    setStatus(null);

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setStatus("success");
      formRef.current.reset();
      toast.success(t("contact.form.success"));
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      toast.error(t("contact.form.error"));
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    {
      icon: Mail,
      label: t("contact.info.email"),
      value: t("personal.contact.email"),
      href: `mailto:${t("personal.contact.email")}`,
    },
    {
      icon: MapPin,
      label: t("contact.info.location"),
      value: t("personal.contact.location"),
    },
  ];

  return (
    <section
      id="contato"
      className="py-24 md:py-32 bg-background border-t border-border"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label={t("contact.label")}
          title={t("contact.title")}
          description={t("contact.subtitle")}
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-6">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="group flex items-start space-x-4 p-4 border border-border hover:border-midground transition-colors"
              >
                <div className="w-12 h-12 shrink-0 border border-border flex items-center justify-center text-midground">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">
                    {item.label}
                  </h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-foreground hover:text-midground transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-foreground">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-none border-border hover:border-midground hover:bg-midground hover:text-primary-foreground"
                asChild
              >
                <a href={t("personal.contact.github")} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-none border-border hover:border-midground hover:bg-midground hover:text-primary-foreground"
                asChild
              >
                <a href={t("personal.contact.linkedin")} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          <Card className="rounded-none border-border bg-background">
            <CardHeader>
              <CardTitle className="font-mono text-sm tracking-[0.15em] uppercase text-midground">
                {t("contact.form.send")}
              </CardTitle>
              <CardDescription>{t("contact.form.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-mono text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2"
                  >
                    {t("contact.form.name")}
                  </label>
                  <Input
                    id="name"
                    name="from_name"
                    placeholder={t("contact.form.name")}
                    required
                    className="rounded-none border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:border-midground focus:ring-midground/30"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2"
                  >
                    {t("contact.form.email")}
                  </label>
                  <Input
                    id="email"
                    name="reply_to"
                    type="email"
                    placeholder={t("contact.form.email")}
                    required
                    className="rounded-none border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:border-midground focus:ring-midground/30"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block font-mono text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2"
                  >
                    {t("contact.form.message")}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t("contact.form.message")}
                    rows={4}
                    required
                    className="rounded-none border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:border-midground focus:ring-midground/30"
                  />
                </div>

                {status === "error" && (
                  <div className="font-mono text-xs text-destructive">
                    {t("contact.form.error")}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-none bg-midground text-primary-foreground hover:bg-midground/90 font-mono text-xs tracking-[0.15em] uppercase h-11"
                  disabled={loading}
                >
                  {loading ? (
                    t("contact.form.sending")
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t("contact.form.send")}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
