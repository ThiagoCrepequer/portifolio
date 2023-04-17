import React from 'react'
import styles from './Card.module.scss'

export default function Card({dados}) {
    return (
        <div className={styles.card}>
            <div className={styles.card__imagem}>
                <img src='/assets/imgs/pokebola.png' alt=''/>
            </div>

            <div>
                <h2>{dados.title}</h2>
                <p>{dados.description}</p>
                {dados.tecnologias.map(icone => {
                    return <img src={`/assets/icons/${icone}.svg`} width={40} alt={icone} key={icone}/>
                })}
            </div>
        </div>
  )
}
