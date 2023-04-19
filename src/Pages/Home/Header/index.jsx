import React, { useEffect, useState } from 'react'
import styles from './Header.module.scss'

export default function Header() {
    const [text, setText] = useState("");

    function digitacao() {
        const element = document.querySelector("p[data-text]");
        const originalText = element.getAttribute("data-text");
        let currentIndex = 0;

        const intervalId = setInterval(() => {
            const currentText = originalText.slice(0, currentIndex + 1);

            setText(currentText);

            if (currentText === originalText) {
                clearInterval(intervalId);
            } else {
                currentIndex++;
            }
        }, 80);

        return () => clearInterval(intervalId);
    }

    useEffect(() => {
        setTimeout(digitacao, 2400)
    }, []);

    return (
        <div className={styles.header}>
            <h1 id='titulo-texto' data-text="THIAGO CREPEQUER">THIAGO CREPEQUER</h1>
            <p data-text="Engenheiro de Software especialista em desenvolvimento web Full-Stack">{text}</p>
        </div>
    )
}

//<div className={styles.header__skills}>
//    {description.skills.map(skill => (
//        <img src={url(skill)} alt={skill} key={skill} width={40} />
//    ))}
//</div>