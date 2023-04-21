import React from 'react'
import styles from './CardProjeto.module.scss'
import Icon from 'Components/Icon'

export default function CardProjeto({ children, icones, urls }) {
    return (
        <div className={styles.card}>
            <img src={urls[0]} alt='' className={styles.card__image} />
            <p>{children}</p>
            {icones.map((icone, index) => (
                <Icon nome={icone} key={index} size={30} />
            ))}
        </div>
    )
}
