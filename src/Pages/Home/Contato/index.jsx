import React from 'react'
import styles from './Contato.module.scss'
import Titulo from 'Components/Titulo'
import { BsInstagram, BsLinkedin } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import SubTitulo from 'Components/SubTitulo'
import Section from 'Components/Section'
import Bloco, { Icone } from './Bloco'

export default function Contato() {
    return (
        <Section>
            <Titulo>Contatos</Titulo>
            <div className={styles.container}>
                <SubTitulo>Let's talk</SubTitulo>
                <address className={styles.infos}>

                    <Bloco>
                        <Icone>
                            <BsInstagram size={25} />
                        </Icone>

                        <a href='https://www.instagram.com/t.crepequer/' target='_blank'>t.crepequer</a>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna</p>
                    </Bloco>

                    <Bloco>
                        <Icone>
                            <BsLinkedin size={25} />
                        </Icone>

                        <a href='https://www.linkedin.com/in/thiago-crepequer/'>thiago-crepequer</a>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna</p>
                    </Bloco>

                    <Bloco>
                        <Icone>
                            <MdEmail size={25} />
                        </Icone>

                        <a href='email:thiago.crepequer@hotmail.com'>thiago@crepequer.tk</a>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna</p>
                    </Bloco>
                </address>
            </div>

        </Section>
    )
}
