import React from 'react'
import styles from './Card.module.scss'
import Icon from 'Components/Icon'

export default function Card({dados}) {
    return (
        <div className={styles.card}>
            <div>
                <h2>{dados.title}</h2>
                <p>{dados.description}</p>
                {dados.tecnologias.map(icone => {
                    return <Icon nome={icone} size={40} key={icone}/>
                })}
            </div>
        </div>
  )
}
