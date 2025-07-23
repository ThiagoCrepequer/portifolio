import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "./i18n"

// SEO Meta tags
document.title = "Thiago Crepequer - Desenvolvedor Full-Stack"
const metaDescription = document.querySelector('meta[name="description"]')
if (metaDescription) {
  metaDescription.setAttribute(
    "content",
    "Desenvolvedor Full-Stack especializado em Java, React e React Native. Criando soluções digitais robustas e escaláveis.",
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
