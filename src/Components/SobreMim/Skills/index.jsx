import React from 'react'
import skills from './skills.json'
import Skill from '../Skill'
import styles from './Skills.module.scss'
import SubTitulo from '../../SubTitulo'

export default function Skills() {
  return (
    <div className={styles.skills}>
        <SubTitulo>Skills</SubTitulo>
        <div className={styles.skills__container}>
            {skills.map(skill => (
                <Skill arquivo={skill.arquivo} titulo={skill.titulo} />
            ))}
        </div>
    </div>
  )
}
