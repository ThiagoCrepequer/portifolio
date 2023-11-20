'use client'

import { createContext, useState } from 'react';
import useSWR from 'swr';

const fetcher = async (url) => {
    const res = await fetch(url);
    return res.json();
};

export const LanguageContext = createContext();

export const LanguageContextProvider = ({ children }) => {
    const [language, setLanguage] = useState('pt-br');

    const { data: texts } = useSWR(`/api/texts?language=${language}`, fetcher);

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, texts }}>
            {children}
        </LanguageContext.Provider>
    );
};