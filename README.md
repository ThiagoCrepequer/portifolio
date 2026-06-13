# Portfolio - Thiago Crepequer

[![Website](https://img.shields.io/badge/Website-crepequer.dev-000000?style=for-the-badge&logo=globe&logoColor=white)](https://crepequer.dev)

Portfólio pessoal desenvolvido com React, TypeScript e Vite, com suporte a internacionalização (i18n) em três idiomas e otimizações de SEO.

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **React i18next** - Internacionalização (pt-BR, en, es)

## 🚀 Como Executar

```bash
# Clone o repositório
git clone https://github.com/thiagocrepequer/portfolio.git
cd portfolio

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## ✨ Funcionalidades

- **Responsive Design** - Adaptável para todos os dispositivos
- **Internacionalização** - Suporte a 3 idiomas (pt-BR, en, es)
- **SEO Otimizado** - Meta tags, schema.org, sitemap
- **PWA Ready** - Progressive Web App
- **Performance** - Otimizado com Vite

## � Estrutura

```
src/
├── components/       # Componentes React
├── hooks/           # Hooks customizados
├── i18n/            # Configuração de idiomas
│   └── locales/     # Arquivos de tradução
├── types/           # Tipos TypeScript
└── data/            # Dados estáticos
```

## 📄 Scripts

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview da build
```

## ✉️ Enviar e-mails (EmailJS)

Este projeto pode enviar mensagens a partir do formulário de contato usando EmailJS.

1. Crie um arquivo `.env` na raiz com as variáveis abaixo (você pode copiar `.env.example`):

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

2. Configure um serviço e um template no EmailJS (https://www.emailjs.com) e preencha as variáveis.

Após isso o formulário de contato em `src/components/Contact.tsx` enviará as mensagens usando EmailJS.

## Contato

- **Website**: [crepequer.dev](https://crepequer.dev)
- **Email**: thiago@crepequer.dev
- **GitHub**: [thiagocrepequer](https://github.com/thiagocrepequer)

---

Desenvolvido por **Thiago Crepequer**
