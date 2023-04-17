import React from 'react'
import styles from './SubTitulo.module.scss'

export default function SubTitulo({children}) {
  return (
    <h2><span className={styles.tituloEsquerda}></span>{children}<span className={styles.tituloDireita}></span></h2>
  )
}
