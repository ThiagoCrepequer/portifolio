import React from 'react'
import styles from './Menu.module.scss'
import { NavLink } from 'react-router-dom'

export default function Menu({ position = "absolute" }) {

    function addBordaPaginaAtual({ isActive }) {
        return isActive ? `${styles.menu__active} ${styles.menu__padrao}` : styles.menu__padrao
    }

    return (
        <nav className={styles.menu} style={{
            position: position
        }}>
            <ul>
                <li><NavLink fade to="/" className={addBordaPaginaAtual}>Home</NavLink></li>
                <li><NavLink to="/contato" className={addBordaPaginaAtual}>Contato</NavLink></li>
                <li><NavLink to="/about" className={addBordaPaginaAtual}>Sobre mim</NavLink></li>
                <li><NavLink fade to="/projetos" className={addBordaPaginaAtual}>Projetos</NavLink></li>
            </ul>
        </nav>
    )
}
