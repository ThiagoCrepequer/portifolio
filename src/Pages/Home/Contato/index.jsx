import React from 'react'
import styles from './Contato.module.scss'
import Titulo from 'Components/Titulo'
import {BsInstagram, BsLinkedin} from 'react-icons/bs'
import {MdEmail} from 'react-icons/md'
import SubTitulo from 'Components/SubTitulo'
import Section from 'Components/Section'

export default function Contato() {
  return (
    <Section>
        <Titulo>Contatos</Titulo>
        <div className={styles.container}>
            <SubTitulo>Let's talk</SubTitulo>
            <address className={styles.infos}>
                <p>
                    <div className={styles.infos__icone}>
                        <MdEmail size={20}/>    
                    </div>
                    thiago@crepequer.tk
                </p>
                <p>
                    <div className={styles.infos__icone}>
                        <BsLinkedin size={20}/>
                    </div>
                    <a href='https://www.linkedin.com/in/thiago-crepequer/'>thiago-crepequer</a>
                </p>
                <p>
                    <div className={styles.infos__icone}>
                        <BsInstagram size={20}/>
                    </div>
                    <a href='https://www.instagram.com/t.crepequer/'>t.crepequer</a>
                </p>
            </address>
        </div>
        
    </Section>
  )
}
