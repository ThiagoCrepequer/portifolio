import React, { useEffect, useState } from 'react'
import styles from './BarraFiltros.module.scss'
import Tecnologias from './Tecnologias'
import Stacks from './Stacks'
import SubTitulo from '../SubTitulo'
import data from '../../assets/jsons/projetos.json'

export default function BarraFiltros({onFiltro}) {
    const [filtroTecno, setFiltroTecno] = useState([])
    const [filtroStack, setFiltroStack] = useState([])

    function handleAddRemoveFiltro(listaOriginal, value) {
        let newLista = [...listaOriginal];
        let newValue = value.toLowerCase()

        if (newLista.indexOf(newValue) === -1) {
            newLista.push(newValue);
        } else {
            let index = newLista.indexOf(newValue);
            if (index !== -1) {
                newLista.splice(index, 1);
            }
        }

        return newLista;
    }

    function handleClick(e) {
        const value = e.target.title;
        const type = e.target.placeholder;

        if (type === "stacks") {
            setFiltroStack(handleAddRemoveFiltro(filtroStack, value))
        }

        if (type === "tecnologias") {
            setFiltroTecno(handleAddRemoveFiltro(filtroTecno, value))
        }
    }

    useEffect(() => {
        onFiltro(filtroStack, filtroTecno)
    }, [filtroStack, filtroTecno, onFiltro])

    const uniqueTecno = new Set();
    data.forEach(item => {
        item.tecnologias.forEach(tecno => uniqueTecno.add(tecno));
    });
    const arrayTecnologias = Array.from(uniqueTecno)
    

    const uniqueStacks = new Set();
    data.forEach(item => {
        item.stacks.forEach(stack => uniqueStacks.add(stack));
    });
    const arrayStacks = Array.from(uniqueStacks)

    return (
        <aside className={styles.section}>
            <SubTitulo>Filtros</SubTitulo>
            <ul className={styles.section__lista}>
                <Tecnologias tecnologias={arrayTecnologias} onClick={handleClick} />
                <Stacks stacks={arrayStacks} onClick={handleClick} />
            </ul>
        </aside>
    )
}
