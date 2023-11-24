'use client';

import projetos from "@/constants/language/projects.json";
import useLanguage from "@/hooks/useLanguage";
import { useEffect, useState } from "react";
import './styles.css';

export default function Carousel() {
    const language = useLanguage();
    const [projects, setProjects] = useState(projetos[language]);
    const duration = 500;
    let lastScrollTime = 0;

    function scrollTo(element, to, duration, callback = () => { }) {
        const start = element.scrollLeft;
        const change = to;
        const increment = 20;
        let currentTime = 0;
        lastScrollTime = Date.now();

        function animateScroll() {
            currentTime += increment;
            const val = easeInOutQuad(currentTime, start, change, duration);
            element.scrollLeft = val;
            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            } else {
                callback();
            }
        }

        animateScroll();
    }

    const handleResize = (currentProjects = projects) => {
        const middleIndex = Math.floor(currentProjects.length / 2);
        const middleProject = document.getElementById(`project_${currentProjects[middleIndex].id}`);
        const previousProject = document.getElementById(`project_${currentProjects[middleIndex - 1].id}`);
        // middleProject.setAttribute('style', 'transform: scaleX(1.2);');
        // previousProject.setAttribute('style', 'transform: scaleX(1);');
    }

    useEffect(() => {
        const carousel = document.getElementById('carousel');
        const cantainerCarousel = document.getElementById('container-carousel');

        var horizontalOffset = (cantainerCarousel.scrollWidth - carousel.clientWidth) / 2;
        scrollTo(carousel, horizontalOffset, duration);
        handleResize();
    }, []);

    const handleNext = () => {
        if (Date.now() - lastScrollTime < 2000) return;

        const carousel = document.getElementById('carousel');
        scrollTo(carousel, 480, duration, () => {
            const newProjects = [...projects];
            newProjects.push(newProjects.shift());
            setProjects(newProjects);
            carousel.scrollLeft -= 480;
            
            handleResize(newProjects);
        });
    }

    const handleBack = () => {
        if (Date.now() - lastScrollTime < 2000) return;

        const carousel = document.getElementById('carousel');
        scrollTo(carousel, -380, duration, () => {
            const newProjects = [...projects];
            newProjects.unshift(newProjects.pop());
            setProjects(newProjects);
            carousel.scrollLeft += 400;
        });
    }

    return (
        <section className="relative">
            <div className="overflow-hidden" id="carousel">
                <button className="absolute left-0 top-0 h-full" onClick={handleBack}>
                    Anterior
                </button>
                <div className="flex flex-nowrap w-full" id="container-carousel">
                    {projects.map((projeto) => (
                        <div key={projeto.id} id={`project_${projeto.id}`} className="teste min-w-[300px] h-[200px] mx-10 border bg-red-700">
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

function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
}