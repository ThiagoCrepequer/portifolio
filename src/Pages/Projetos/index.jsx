import React, { useState } from 'react'
import styles from './Projetos.module.scss';
import Titulo from '../../Components/Titulo';
import BarraFiltros from '../../Components/BarraFiltros';
import TodosProjetos from '../../Components/TodosProjetos';
import dados from '../../assets/jsons/projetos.json'

export default function Projetos() {
    const [filtroStack, setFiltroStack] = useState([])
    const [filtroTecno, setFiltroTecno] = useState([])

    function handleFiltro(filtroStack, filtroTecno) {
        setFiltroStack(filtroStack)
        setFiltroTecno(filtroTecno)
    }

    const resultado = dados.filter(objeto => {
        const stacksEncontradas = objeto.stacks.filter(stack => filtroStack.includes(stack));
        if (stacksEncontradas.length !== filtroStack.length) {
            return false;
        }

        const tecnologiasEncontradas = objeto.tecnologias.filter(tecnologia => filtroTecno.includes(tecnologia));
        if (tecnologiasEncontradas.length !== filtroTecno.length) {
            return false;
        }

        return true;
    });

    return (
        <>
            <div className={styles.header}>
                <Titulo>Projetos</Titulo>
            </div>

            <main className={styles.main}>
                <BarraFiltros onFiltro={handleFiltro} />
                <TodosProjetos dados={resultado}/>
            </main>
        </>

    )
}
