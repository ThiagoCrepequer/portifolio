import Image from "next/image";
import SocialMedia from "./SocialMedia";
import texts from "@constants/header_texts.json";
import "./styles.css";

export default function Header() {
    return (
        <header id="home" className="flex-center-all h-[85vh] w-full">
                <div className="flex flex-wrap max-w-[700px] w-full">
                    <section className="flex-center-all gap-[2px] flex-col responsive-width">
                        <h1 className="text-xl text-center font-bold max-w-[400px]">
                            {texts["pt-br"].title}
                        </h1>
                        <p className="text-center max-w-[400px]">
                            {texts["pt-br"].subtitle}
                        </p>
                        <SocialMedia />
                    </section>

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