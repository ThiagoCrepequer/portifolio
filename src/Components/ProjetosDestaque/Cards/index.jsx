import React from 'react'
import Card from '../Card'
import dados from '../../../assets/jsons/projetos.json'
import styles from './Cards.module.scss'

export default function Cards() {
  return (
    <div className={styles.projetos}>
        {dados.map(dado => (
            <Card dados={dado} key={dado} />
        ))}
    </div>
  )
}
