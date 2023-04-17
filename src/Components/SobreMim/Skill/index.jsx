import React from 'react'
import styles from './Skill.module.scss'

export default function Skill({arquivo, titulo}) {
  return (
    <div className={styles.skill}>
        <img src={`/assets/icons/${arquivo}.svg`} alt={titulo} width={45}/>
        <p>{titulo}</p>
    </div>     
  )
}
