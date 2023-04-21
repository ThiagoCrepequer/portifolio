import React from 'react'
import styles from './Projetos.module.scss'
import Cards from './Cards'
import Titulo from 'Components/Titulo'
import Section from 'Components/Section'
import dados from 'assets/jsons/projetos.json'
import { Link } from 'react-router-dom'

export default function ProjetosDestaque() {   
    function selectRandomObject() {
        const ultimosObjetos = dados.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

        return ultimosObjetos;
    }

    return (
        <Section className={styles.projetosDestaque}>
            <Titulo>Projetos em destaque</Titulo>

            <div className={styles.section__texto}>
                <p>Os projetos a seguir são notáveis pela sua complexidade e pela utilização de diversas tecnologias em seu desenvolvimento.</p>
            </div>
            
            <Cards dados={selectRandomObject()}/>

            <p className={styles.projetosDestaque__subtitulo}>Veja os outros projetos <Link to='/projetos'>aqui</Link></p>
        </Section>
    )
}
