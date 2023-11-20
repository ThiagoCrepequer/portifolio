import Image from "next/image";
import "./styles.css";
import Title from "./Title";

export default function Header() {
    return (
        <header id="home" className="flex-center-all h-[85vh] w-full">
            <div className="flex flex-wrap max-w-[700px] w-full">
                <Title />

                <section className="flex-center-all responsive-width">
                    <Image
                        className="rounded-full w-[250px] border-2 border-black"
                        src="/perfil.webp"
                        alt="Foto de perfil"
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