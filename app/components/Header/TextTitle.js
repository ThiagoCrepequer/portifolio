'use client'

import { LanguageContext } from "@/contexts/LanguageContext";
import { useContext } from "react";

export default function TextTitle() {
    const {texts} = useContext(LanguageContext);
    
    if (!texts) {
        return null;
    }
    
    return (
        <>
            <h1 className="text-xl text-center font-bold max-w-[400px]">
                {texts.title}
            </h1>
            <p className="text-center max-w-[400px]">
                {texts.subtitle}
            </p>
        </>
    )
}