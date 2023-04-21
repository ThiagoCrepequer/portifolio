import Section from 'Components/Section'
import SubTitulo from 'Components/SubTitulo'
import Titulo from 'Components/Titulo'
import React from 'react'
import dados from 'assets/jsons/contatos.json'
import BlocoContato from 'Components/BlocoContato'
import Icon from 'Components/Icon'
import styles from './Contatos.module.scss'

export default function Contatos() {
    return (
        <Section className={styles.section}>
            <Titulo>Contatos</Titulo>
            <div className={styles.contatos}>

                <div className={styles.container}>
                    <SubTitulo>Redes Sociais</SubTitulo>

                    <div className={styles.container__blocos}>
                        {dados.redes_sociais.map(element => (
                            <BlocoContato icone key={element.nome} >
                                <Icon pasta="contatos" nome={element.nome} size={40}/>
                                <a href={element.link} target='_blank' rel='noreferrer'>{element.descricao}</a>
                            </BlocoContato>
                        ))}
                    </div>
                </div>

                <div className={styles.container}>
                    <SubTitulo>Emails</SubTitulo>

                    <div className={styles.container__blocos}>
                        {dados.emails.map(element => (
                            <BlocoContato icone key={element.nome}>
                                <Icon pasta="contatos" nome="email" size={40}/>
                                <a href={`email:${element.email}`} target='_blank' rel='noreferrer'>{element.email}</a>
                            </BlocoContato>
                        ))}
                    </div>
                </div>

                <div className={styles.container}>
                    <SubTitulo>Outros</SubTitulo>

                    <div className={styles.container__blocos}>
                        {dados.outros.map(element => (
                            <BlocoContato icone key={element.nome}>
                                <Icon pasta="contatos" nome={element.nome} size={40}/>
                                <a href={`email:${element.link}`} target='_blank' rel='noreferrer'>{element.descricao}</a>
                            </BlocoContato>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    )
}
