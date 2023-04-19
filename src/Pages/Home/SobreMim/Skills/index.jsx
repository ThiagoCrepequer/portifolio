import React from 'react'
import Skill from '../Skill'
import styles from './Skills.module.scss'
import SubTitulo from '../../../../Components/SubTitulo'
import { getUniqueValueProjeto } from 'assets/js/getUniqueValueProjeto'

export default function Skills() {
    const skills = getUniqueValueProjeto('tecnologias')
    
    return (
        <div className={styles.skills}>
            <SubTitulo>Skills</SubTitulo>
            <div className={styles.skills__container}>
                {skills.map(skill => (
                    <Skill value={skill} key={skill} />
                ))}
            </div>
        </div>
    )
}
