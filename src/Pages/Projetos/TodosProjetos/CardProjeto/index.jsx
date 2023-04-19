import React from 'react'
import styles from './CardProjeto.module.scss'
import Icon from 'Components/Icon'

export default function CardProjeto({ children, icones}) {
  return (
    <div className={styles.card}>
        <img src={'/assets/imgs/pokebola.png'} alt='' className={styles.card__image}/>
        <p>{children}</p>
        {icones.map((icone, index) => (
            <Icon nome={icone} key={index} size={30}/>
        ))}
    </div>
  )
}
