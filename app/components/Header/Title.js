'use client'

import SocialMedia from "./SocialMedia";
import texts from '@/constants/language/header.json';
import useLanguage from "@/hooks/useLanguage";

export default function Title() {
    const language = useLanguage();

    return (
        <section className="flex-center-all gap-[6px] flex-col min-w-[350px] w-full md:w-[50%] px-[10px]">
            <h1 className="text-2xl md:text-[30px] text-center font-bold">
                {texts[language].title}
            </h1>
            <p className="text-center md:text-[20px] max-w-[600px]">
                {texts[language].subtitle}
            </p>
            <SocialMedia />
        </section>
    )
}