import React from 'react'
import styles from './SobreMim.module.scss'
import Skills from './Skills'
import Titulo from '../../../Components/Titulo'
import Section from '../../../Components/Section'
import ProgressBar from '../../../Components/ProgressBar'
import { Link } from 'react-router-dom'
import {FaExternalLinkAlt} from 'react-icons/fa'

export default function SobreMim() {
    return (
        <Section background="linear-gradient(0deg, rgb(13, 17, 39) 0%, rgba(0,0,0,1) 65%)">
            <Titulo>Sobre mim</Titulo>
            <div className={styles.container}>
                <div className={styles.containerInfo}>
                    <div className={styles.containerInfo__detalhes}>
                        <h2>Biografia</h2>
                        <p>Olá! Meu nome é Thiago, sou um desenvolvedor Full-Stack apaixonado por tecnologia e por programação. Estou constantemente em busca de novos desafios além de estar sempre atrás de soluções criativas e inovadoras para problemas complexos</p>
                        <Link to="/sobremim">Saiba mais <FaExternalLinkAlt/></Link>
                    </div>

                    <div className={styles.containerInfo__detalhes}>
                        <h2>Formações</h2>

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

            <div className={styles.cv}>
                <p>*Curriculum Vitae disponível para download <a href='/assets/pdf/cv.pdf' download="thiago-crepequer.pdf">aqui</a></p>
            </div>
        </Section>
    )
}