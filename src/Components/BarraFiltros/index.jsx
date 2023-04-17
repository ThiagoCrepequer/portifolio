import React, { useState } from 'react'
import styles from './BarraFiltros.module.scss'
import Tecnologias from './Tecnologias'
import Stacks from './Stacks'
import SubTitulo from '../SubTitulo'
import data from '../../assets/jsons/projetos.json'

export default function BarraFiltros() {
    const [filtroTecno, setFiltroTecno] = useState([])
    const [filtroStack, setFiltroStack] = useState([])

    function handleAddRemoveFiltro(listaOriginal, value) {
        const newLista = listaOriginal;

        if (newLista.indexOf(value) === -1) {
            return newLista.push(value);
        }

        let index = newLista.indexOf(value);
        if (index !== -1) {
            newLista.splice(index, 1);
            return newLista;
        }
    }

    function handleClick(e) {
        const value = e.target.title;
        const type = e.target;
    
        console.log(type.tipo)

        if(type === "stacks") {
            console.log(handleAddRemoveFiltro(filtroStack, value))
        }
    }

    const uniqueStacks = new Set();

    data.forEach(item => {
        item.tecnologias.forEach(stack => uniqueStacks.add(stack));
    });

    const arrayTecnologias = Array.from(uniqueStacks)

    return (
        <aside className={styles.section}>
            <SubTitulo>Filtros</SubTitulo>
            <ul className={styles.section__lista}>
                <Tecnologias tecnologias={arrayTecnologias} onClick={handleClick} />
                <Stacks onClick={handleClick} />
            </ul>
        </aside>
    )
}
