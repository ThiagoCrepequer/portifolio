import Image from "next/image";
import Title from "./Title";

export default function Header() {

    return (
        <header id="home" className="flex-center-all h-[100vh] 2xl:h-[85vh] w-full">
            <div className="flex flex-col md:flex-row gap-6 md:gap-0 flex-wrap md:max-w-[1300px] w-full items-center">
                <Title />

                <section className="flex-center-all md:min-w-[350px] w-full md:w-[50%]">
                    <Image
                        className="rounded-full min-w-[200px] max-w-[350px] border-2 border-black"
                        src="/perfil.webp"
                        alt="Foto de perfil"
                        width={2208}
                        height={2208}
                        quality={100}
                    />
                </section>
            </div>
        </header>
    )
}