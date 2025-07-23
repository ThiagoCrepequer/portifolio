import Header from "./components/Header"
import Hero from "./components/Hero"
import About from "./components/About"
import Technologies from "./components/Technologies"
import ExperienceSection from "./components/Experience"
import Projects from "./components/Projects"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import useLanguageTitle from "./hooks/useLanguageTitle"

function App() {
  useLanguageTitle()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <About />
        <Technologies />
        <ExperienceSection />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
