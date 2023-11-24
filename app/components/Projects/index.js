import Image from "next/image";
import Card from "./Card";
import Carousel from "./Carousel";

export default function Projects() {
    return (
        <section>
            <h1 className="titulo text-center">Projetos</h1>
            <h2 className="text-center">Conheça meus principais projetos</h2>

            <Carousel />
        </section>
    )
}