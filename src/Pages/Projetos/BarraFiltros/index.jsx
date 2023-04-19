import React, { useEffect, useState } from 'react'
import styles from './BarraFiltros.module.scss'
import Tecnologias from './Tecnologias'
import Stacks from './Stacks'
import SubTitulo from 'Components/SubTitulo'
import { getUniqueValueProjeto } from 'assets/js/getUniqueValueProjeto'

export default function BarraFiltros({onFiltro}) {
    const [filtroTecno, setFiltroTecno] = useState([])
    const [filtroStack, setFiltroStack] = useState([])

    function handleAddRemoveFiltro(listaOriginal, value) {
        let newLista = [...listaOriginal];

        if (newLista.indexOf(value) === -1) {
            newLista.push(value);
        } else {
            let index = newLista.indexOf(value);
            if (index !== -1) {
                newLista.splice(index, 1);
            }
        }

        return newLista;
    }

    function handleClickFiltro(e) {
        const value = e.target.title;
        const type = e.target.placeholder;

        if (type === "stacks") {
            setFiltroStack(handleAddRemoveFiltro(filtroStack, value))
        }

        if (type === "tecnologias") {
            setFiltroTecno(handleAddRemoveFiltro(filtroTecno, value))
        }
    }

    

    const arrayTecnologias = getUniqueValueProjeto('tecnologias')
    const arrayStacks = getUniqueValueProjeto('stacks')

    useEffect(() => {
        onFiltro(filtroStack, filtroTecno)
    }, [filtroStack, filtroTecno, onFiltro])

    return (
        <aside className={styles.section}>
            <SubTitulo>Filtros</SubTitulo>
            <ul className={styles.section__lista}>
                <Tecnologias tecnologias={arrayTecnologias} onClick={handleClickFiltro} />
                <Stacks stacks={arrayStacks} onClick={handleClickFiltro} />
            </ul>
        </aside>
    )
}
