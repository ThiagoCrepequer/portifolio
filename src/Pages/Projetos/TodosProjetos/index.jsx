import React from 'react'
import CardProjeto from './CardProjeto'
import styles from './TodosProjetos.module.scss'

export default function TodosProjetos({dados}) {
    console.log(dados[0].image)
  return (
    <div className={styles.container}>
        {dados.map(dado => (
            <CardProjeto urls={dado.image} icones={dado.tecnologias} key={dado.title}>{dado.title}</CardProjeto>        
        ))}
    </div>
  )
}
