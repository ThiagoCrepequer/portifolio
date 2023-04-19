import React from 'react'
import styles from './SobreMim.module.scss'
import Skills from './Skills'
import Titulo from '../../../Components/Titulo'
import Section from '../../../Components/Section'
import ProgressBar from '../../../Components/ProgressBar'

export default function SobreMim() {
    return (
        <Section background="linear-gradient(0deg, rgb(13, 17, 39) 0%, rgba(0,0,0,1) 65%)">
                <Titulo>Sobre mim</Titulo>
                <div className={styles.container}>
                    <div className={styles.containerInfo}>
                        <div className={styles.containerInfo__detalhes}>
                            <h2>Minha história</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>

                        <div className={styles.containerInfo__detalhes}>
                            <h2>Formações</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut e</p>

                            <div className={styles.containerInfo__detalhes__formacoes}>
                                <div>
                                    <h3>Colégio Militar de Brasília</h3>
                                    <h4>Ensino Médio</h4>
                                    <ProgressBar size={90} progress={100} />
                                </div>

                                <div>
                                    <h3>Unicesumar</h3>
                                    <h4>Engenharia de Software</h4>
                                    <ProgressBar size={90} progress={4} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.containerFoto}>
                        <img src='/assets/imgs/profile2.jpg' alt='foto de perfil' />
                    </div>
                </div>

                <Skills />
        </Section>
    )
}