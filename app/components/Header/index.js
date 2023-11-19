import Image from "next/image";
import SocialMedia from "./SocialMedia";

export default function Header() {
    return (
        <header className="flex-center-all h-[90vh] w-full">
                <div className="flex flex-wrap max-w-[700px] w-full">
                    <section className="flex-center-all gap-[2px] flex-col responsive-width">
                        <h1 className="text-3xl font-bold">Thiago Crepequer</h1>
                        <p>Desenvolvedor Full-Stack</p>
                        <SocialMedia />
                    </section>

                    <section className="flex-center-all responsive-width">
                        <Image 
                            className="rounded-full w-[250px] border-2 border-black"
                            src="/perfil.webp"
                            width={2208} 
                            height={2208}
                            quality={100}
                            priority={true}
                        />
                    </section>
                </div>
            </header>
    )
}