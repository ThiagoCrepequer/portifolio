"use client"

import type { FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { Mail, MapPin, Github, Linkedin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card"
import Button from "./ui/Button"
import Input from "./ui/Input"
import Textarea from "./ui/Textarea"

const Contact = () => {
  const { t } = useTranslation()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Aqui você pode integrar com um serviço de email como EmailJS
    console.log("Form submitted")
  }

  return (
    <section id="contato" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("contact.title")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-gray-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{t("contact.info.email")}</h3>
                <p className="text-gray-600">{t("personal.contact.email")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="h-6 w-6 text-gray-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{t("contact.info.location")}</h3>
                <p className="text-gray-600">{t("personal.contact.location")}</p>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button variant="outline" size="icon">
                <a href={t("personal.contact.github")} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon">
                <a href={t("personal.contact.linkedin")} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t("contact.form.send")}</CardTitle>
              <CardDescription>Preencha o formulário abaixo e entrarei em contato em breve</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contact.form.name")}
                  </label>
                  <Input id="name" name="name" placeholder={t("contact.form.name")} required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contact.form.email")}
                  </label>
                  <Input id="email" name="email" type="email" placeholder={t("contact.form.email")} required />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contact.form.message")}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t("contact.form.message")}
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t("contact.form.send")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Contact
