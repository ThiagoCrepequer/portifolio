import React from 'react'
import styles from './Menu.module.scss'
import { NavLink } from 'react-router-dom'

export default function Menu() {

    function addBordaPaginaAtual({ isActive }) {
        return isActive ? `${styles.menu__active} ${styles.menu__padrao}` : styles.menu__padrao
    }

    return (
        <nav className={styles.menu} >
            <ul>
                <li><NavLink to="/" className={addBordaPaginaAtual}>Home</NavLink></li>
                <li><NavLink to="/contatos" className={addBordaPaginaAtual}>Contato</NavLink></li>
                <li><NavLink to="/sobremim" className={addBordaPaginaAtual}>Sobre mim</NavLink></li>
                <li><NavLink to="/projetos" className={addBordaPaginaAtual}>Projetos</NavLink></li>
            </ul>
        </nav>
    )
}
