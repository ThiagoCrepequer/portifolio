"use client";

import useLanguage from "@/hooks/useLanguage";
import texts from "@/constants/language/about.json";

export default function About() {
    const langauge = useLanguage();
    return (
        <section id="about" className="w-full flex justify-center items-center flex-col">
            <h1 className="titulo">{texts[langauge].title} 👨🏻‍💻</h1>
            <h2 className="max-w-[1000px] text-center">{texts[langauge].subtitle}</h2>

            <div className="max-w-[1000px] flex flex-col justify-center mt-12">
                <aside className="flex justify-center">
                    {texts[langauge].menus.map((menu, index) => (
                        <button 
                            key={index} 
                            onClick={() => {}}
                            className="border px-4 py-2 rounded-md hover:bg-gray-200"
                        >
                            {menu}
                        </button>
                    ))}
                </aside>
                <article className="h-[20vh] max-w-[1000px] border">
                    <p className="w-full">asd</p>
                </article>
            </div>
        </section>
    )
}