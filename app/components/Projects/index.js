import Image from "next/image";
import Card from "./Card";
import dataProjects from "@constants/cards_projects.json";

export default function Projects() {
    return (
        <section className="flex-center-all flex-col">
            <h1 className="titulo">Projetos</h1>
            <h2 className="">Conheça meus principais projetos</h2>

            <div className="flex flex-wrap gap-12 mt-6">
                {dataProjects.map((projeto, index) => (
                    <Card
                        key={index}
                        title={projeto.title}
                        description={projeto.description}
                    >
                        <Image 
                            className="rounded-md w-[190px] h-[200px]"
                            src={projeto.image}
                            alt={projeto.title}
                            width={projeto.width}
                            height={projeto.height}
                            quality={100}
                        />
                    </Card>
                ))}
            </div>
        </section>
    )
}