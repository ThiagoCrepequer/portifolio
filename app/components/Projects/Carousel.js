'use client';

import projetos from "@/constants/language/projects.json";
import useLanguage from "@/hooks/useLanguage";
import { useEffect, useState } from "react";

export default function Carousel() {
    const language = useLanguage();
    const [projects, setProjects] = useState(projetos[language]);

    useEffect(() => {
        const carousel = document.getElementById('carousel');
        const cantainerCarousel = document.getElementById('container-carousel');

        var horizontalOffset = (cantainerCarousel.scrollWidth - carousel.clientWidth) / 2;
        carousel.scrollLeft = horizontalOffset;
    }, []);

    const handleNext = () => {
        const newProjects = [...projects];
        newProjects.push(newProjects.shift());
        setProjects(newProjects);
    }

    const handleBack = () => {
        const newProjects = [...projects];
        newProjects.unshift(newProjects.pop());
        setProjects(newProjects);
    }

    return (
        <section className="relative">
            <div className="overflow-hidden" id="carousel">
                <button className="absolute left-0 top-0 h-full" onClick={handleBack}>
                    Anterior
                </button>
                <div className="flex flex-nowrap w-full" id="container-carousel">
                    {projects.map((projeto, index) => (
                        <div key={index} className="min-w-[300px] h-[200px] mx-10 border">
                            <h1>{projeto.title}</h1>
                            <h2>{projeto.technologies}</h2>
                            <p>{projeto.description}</p>
                        </div>
                    ))}
                </div>
                <button className="absolute right-0 top-0 h-full" onClick={handleNext}>
                    Proximo
                </button>
            </div>
        </section>
    )
}