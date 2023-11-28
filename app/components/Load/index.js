'use client';

import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";
import "./styles.css";

export default function Load() {
    const [points, setPoints] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setPoints((oldPoints) => {
                if (oldPoints === '...') {
                    return '';
                } else {
                    return `${oldPoints}.`;
                }
            });
        }, 500);

        return () => clearInterval(interval);
    });

    useLayoutEffect(() => {
        const handleLoad = () => {
            const loading = document.getElementById('loading');
            loading.classList.add('opacity-0');

            setTimeout(() => {
                setLoading(false);
            }, 1000);
        };

        if (document.readyState === "complete") {
            handleLoad();
        }
    }, []);


    return (
        loading 
            ? <div className="absolute w-full h-full flex gap-4 flex-col justify-center items-center bg-white z-10" id="loading">
                <div className="logo">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={100}
                        height={100}
                    />
                </div>
                <div className="w-[100px]">
                    <p>Carregando{points}</p>
                </div>
            </div>
            : null
    )
}