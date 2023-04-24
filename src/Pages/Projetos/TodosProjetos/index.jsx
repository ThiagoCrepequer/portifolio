import React from 'react'
import CardProjeto from './CardProjeto'
import styles from './TodosProjetos.module.scss'
import NotFound from './NotFound'

export default function TodosProjetos({ dados }) {

    console.log(dados)
    
    return (
        <div className={styles.container}>
            {
            dados.length
            ? dados.map(dado => (
                 <CardProjeto urls={dado.image} icones={dado.tecnologias} key={dado.title}>{dado.title}</CardProjeto>
            )) 
            : <NotFound />
        }
        </div>
    )
}
