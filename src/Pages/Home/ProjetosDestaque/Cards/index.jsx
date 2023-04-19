import React from 'react'
import Card from '../Card'
import styles from './Cards.module.scss'

export default function Cards({dados}) {
  return (
    <div className={styles.projetos}>
        {dados.map(dado => (
            <Card dados={dado} key={dado.title} />
        ))}
    </div>
  )
}
