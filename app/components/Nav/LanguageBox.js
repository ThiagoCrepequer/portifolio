'use client';

import { useEffect, useState } from "react";
import languages from "@constants/languages.json";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import { useRouter } from "next/navigation";
import texts from '@/constants/language/nav.json'

export default function LanguagehBox() {
    const router = useRouter()
    const language = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleClick = (event) => {
            const isLanguageButton = event.target.closest("#language-button");

            if (!isLanguageButton) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [isOpen]);

    return (
        <>
            <button
                id="language-button"
                type="button"
                className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-800"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Image
                    src={'/icons/' + language + '.svg'}
                    width={640}
                    height={480}
                    className="w-10"
                    alt={texts[language].selected_language}
                />
                <svg
                    className="-me-1 ms-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M10.293 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            {isOpen && <div
                id="language-box"
                className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                role="menu"
                aria-orientation="vertical"
            >
                <div className="py-1 grid grid-cols-2 gap-2" role="none">
                    {Object.values(languages).map((language, index) => {
                        return (
                            <button
                                key={index}
                                className="flex justify-start items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => {
                                    router.push(`?lang=${language.cod}`);
                                }}
                            >
                                <Image
                                    className="w-7"
                                    width={640}
                                    height={480}
                                    src={language.icon}
                                    alt={language.name}
                                />
                                <span className="truncate">{language.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>}
        </>
    )
}