import React from 'react'
import styles from './Titulo.module.scss'

export default function Titulo({children}) {
  return (
    <h1 className={styles.titulo}>{children}</h1>
  )
}
