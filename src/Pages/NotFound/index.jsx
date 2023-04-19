import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './NotFound.module.scss'

export default function NotFound() {
  return (
    <main className={styles.main}>
        <h1>404</h1>
        <p>Infelizmente não econtramos essa pagina&#128549;. Se quiser retornar para a página inicial é só clicar <NavLink to='/'>aqui</NavLink> ou clicar em voltar&#128521;</p>
        <img src='/assets/gifs/notFound01.gif' alt='gatinho balançando a cabeça'/>
    </main>
  )
}
