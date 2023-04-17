import React from 'react'
import styles from './CardProjeto.module.scss'

export default function CardProjeto({image, children, icones}) {
  return (
    <div className={styles.card}>
        <img src={'/assets/imgs/pokebola.png'} alt='' className={styles.card__image}/>
        <p>{children}</p>
        {icones.map((icone, index) => (
            <img src={`/assets/icons/${icone}.svg`} alt='' className={styles.card__icone} key={index}/>
        ))}
    </div>
  )
}
