"use client";

import useLanguage from "@/hooks/useLanguage";
import texts from "@/constants/language/about.json";
import { useState } from "react";

export default function About() {
    const langauge = useLanguage();
    const [menu, setMenu] = useState("Engenharia de Software");

    return (
        <section id="about" className="w-full flex justify-center items-center flex-col">
            <h1 className="titulo">{texts[langauge].title} 👨🏻‍💻</h1>
            <h2 className="max-w-[1000px] text-center">{texts[langauge].subtitle}</h2>

            <div className=" flex flex-col justiyf-center mt-12">
                <aside className="flex">
                    {Object.keys(texts[langauge].menus).map((menu, index) => (
                        <button
                            key={index}
                            onClick={() => setMenu(menu)}
                            className="border px-4 py-2 rounded-md hover:bg-gray-200"
                        >
                            {menu}
                        </button>
                    ))}
                </aside>
                <article className="h-[20vh] max-w-[1200px] border p-2">
                    <h1 className="text-xl">{texts[langauge].menus[menu].title}</h1>
                    <h2>{texts[langauge].menus[menu].subtitle}</h2>
                    <div>
                        <p>{texts[langauge].menus[menu].description}</p>
                    </div>
                </article>
            </div>
        </section>
    )
}