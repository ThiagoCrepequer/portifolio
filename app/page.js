import About from "./components/About";
import Header from "./components/Header";
import Load from "./components/Load";
import Nav from "./components/Nav";

export default function Home() {
    return (
        <>
            <Load />

            <Nav />
            <Header />

            <main>
                <About />
            </main>
        </>
    )
}
