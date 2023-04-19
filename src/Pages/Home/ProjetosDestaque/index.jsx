import React from 'react'
import styles from './Projetos.module.scss'
import Cards from './Cards'
import Titulo from 'Components/Titulo'
import Section from 'Components/Section'
import dados from 'assets/jsons/projetos.json'

export default function ProjetosDestaque() {
    return (
        <Section>
            <Titulo>Projetos em destaque</Titulo>

            <div className={styles.section__texto}>
                <p>Os projetos a seguir são notáveis pela sua complexidade e pela utilização de diversas tecnologias em seu desenvolvimento.</p>
            </div>
            
            <Cards dados={dados}/>

        </Section>
    )
}
