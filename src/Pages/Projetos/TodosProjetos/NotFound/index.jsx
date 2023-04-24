import React from 'react'
import styles from './NotFound.module.scss'

export default function NotFound() {
    let max = 2;

    let rand = Math.random();
    let range = max - 1 + 1;
    let num = Math.floor(rand * range) + 1;

    return (
        <div className={styles.notFound}>
            <h2>Não encontramos nada com essa combinação &#128531;</h2>
            <img src={`/assets/gifs/notFound${num}.gif`} alt='imagem de gatinho' />
        </div>
    )
}
