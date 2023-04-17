import React from 'react'
import CardProjeto from '../CardProjeto'
import dados from '../../assets/jsons/projetos.json'
import styles from './TodosProjetos.module.scss'

export default function TodosProjetos() {
  return (
    <div className={styles.container}>
        {dados.map(dado => (
            <CardProjeto icones={dado.tecnologias} key={dado.title}>{dado.title}</CardProjeto>        
        ))}
    </div>
  )
}
