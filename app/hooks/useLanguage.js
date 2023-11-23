import { useSearchParams } from "next/navigation";

export default function useLanguage() {
    const searchParams = useSearchParams();
    const language = searchParams.get("lang");

    return language
        ? language
        : 'pt-br';
}