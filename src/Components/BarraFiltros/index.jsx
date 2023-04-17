import React from 'react'
import styles from './BarraFiltros.module.scss'
import Tecnologias from './Tecnologias'
import Stacks from './Stacks'
import SubTitulo from '../SubTitulo'
import data from '../../assets/jsons/projetos.json'

export default function BarraFiltros() {

    const uniqueStacks = new Set(); 

    data.forEach(item => { 
      item.tecnologias.forEach(stack => uniqueStacks.add(stack)); 
    });

    const arrayTecnologias = Array.from(uniqueStacks)

    return (
        <aside className={styles.section}>
            <SubTitulo>Filtros</SubTitulo>
            <ul className={styles.section__lista}>
                <Tecnologias tecnologias={arrayTecnologias} />
                <Stacks />
            </ul>
        </aside>
    )
}
