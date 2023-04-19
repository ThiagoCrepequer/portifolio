import React from 'react'
import Header from './Header'
import SobreMim from './SobreMim'
import styles from './Home.module.scss'
import Contato from './Contato'
import ProjetosDestaque from './ProjetosDestaque'

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
