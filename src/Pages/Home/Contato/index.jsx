import React from 'react'
import styles from './Contato.module.scss'
import Titulo from 'Components/Titulo'
import { BsInstagram, BsLinkedin } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import SubTitulo from 'Components/SubTitulo'
import Section from 'Components/Section'
import BlocoContato, { Icone } from '../../../Components/BlocoContato'

export default function Contato() {
    return (
        <Section>
            <Titulo>Contatos</Titulo>
            <div className={styles.container}>
                <SubTitulo>Let's talk</SubTitulo>
                <address className={styles.infos}>

                    <BlocoContato>
                        <Icone>
                            <BsInstagram size={25} />
                        </Icone>

                        <a href='https://www.instagram.com/t.crepequer/' target='_blank' rel='noreferrer'>t.crepequer</a>
                    </BlocoContato>

                    <BlocoContato>
                        <Icone>
                            <BsLinkedin size={25} />
                        </Icone>

                        <a href='https://www.linkedin.com/in/thiago-crepequer/' target='_blank' rel='noreferrer'>thiago-crepequer</a>
                    </BlocoContato>

                    <BlocoContato>
                        <Icone>
                            <MdEmail size={25} />
                        </Icone>

                        <a href='email:thiago.crepequer@hotmail.com' target='_blank' rel='noreferrer'>thiago@crepequer.tk</a>
                    </BlocoContato>
                </address>
            </div>

        </Section>
    )
}
