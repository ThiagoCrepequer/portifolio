import React from 'react'
import Header from '../../Components/Header'
import SobreMim from '../../Components/SobreMim'
import styles from './Home.module.scss'
import Contato from '../../Components/Contato'
import ProjetosDestaque from '../../Components/ProjetosDestaque'

export default function Home() {
    return (
        <>
            <Header />

            <main className={styles.main}>
                <SobreMim />
                <ProjetosDestaque />
                <Contato />
            </main>
        </>
    )
}
