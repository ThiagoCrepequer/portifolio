import About from "./components/About";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Projects from "./components/Projects";

export default function Home() {
    return (
        <>
            <Nav />
            <Header />

            <main>
                <About />
            </main>
        </>
    )
}
