import Section from 'Components/Section'
import Titulo from 'Components/Titulo'
import React from 'react'
import styles from './SobreMim.module.scss'
import SubTitulo from 'Components/SubTitulo'
import data from './historia.json'
import { motion } from "framer-motion";

export default function SobreMim() {
    return (
        <Section className={styles.sobremim}>
            <Titulo>Sobre mim</Titulo>

            {data.map((element, index) => (
                <motion.div
                    key={index}
                    className={`${styles[element.titulo]} ${styles.sobremim__container}`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                >
                    <SubTitulo>{element.titulo}</SubTitulo>
                    <div className={styles.conteudo}>


                        <p>{element.introducao}</p>

                        <h3>{element.ano}</h3>

                        <div className={styles.conteudo__center}>
                            <div className={styles.conteudo__desenvolvimento}>
                                {element.desenvolvimentos.map((e, index) => (
                                    <p key={index}>{e}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                </motion.div>
            ))}


        </Section>
    )
}

//<div className={styles.imagem}>
//{element.imgs.map(e => (
//    <img src={e.url} alt={e.alt} />
//))}
//</div>