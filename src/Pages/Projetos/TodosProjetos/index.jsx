import React from 'react'
import CardProjeto from './CardProjeto'
import styles from './TodosProjetos.module.scss'

export default function TodosProjetos({dados}) {
  return (
    <div className={styles.container}>
        {dados.map(dado => (
            <CardProjeto icones={dado.tecnologias} key={dado.title}>{dado.title}</CardProjeto>        
        ))}
    </div>
  )
}
