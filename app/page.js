'use client'

import Header from "./components/Header";
import Nav from "./components/Nav";
import Projects from "./components/Projects";
import { LanguageContextProvider } from "./contexts/LanguageContext";


export default function Home() {
    return (
        <>
            <LanguageContextProvider>
                <Nav />
                <Header />
                
                <main>
                    <Projects />
                </main>
            </LanguageContextProvider>
        </>
    )
}
 