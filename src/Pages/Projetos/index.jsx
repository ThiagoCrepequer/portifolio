import React from 'react'
import styles from './Projetos.module.scss';
import Titulo from '../../Components/Titulo';
import BarraFiltros from '../../Components/BarraFiltros';
import TodosProjetos from '../../Components/TodosProjetos';

export default function Projetos() {
    return (
        <>
            <div className={styles.header}>
                <Titulo>Projetos</Titulo>
            </div>

            <main className={styles.main}>
                <BarraFiltros />
                <TodosProjetos />
            </main>
        </>

    )
}
