import React from 'react'
import styles from './Skills.module.scss'
import SubTitulo from '../../../../Components/SubTitulo'
import Icon from 'Components/Icon'

export default function Skills() {
    const skills = [
        "JavaScript",
        "React",
        "NodeJs",
        "Express",
        "Next",
        "Java"
    ]

    return (
        <div className={styles.skills}>
            <SubTitulo>Skills</SubTitulo>
            <div className={styles.skills__container}>
                {skills.map(skill => (
                    <div className={styles.skill} key={skill}>
                        <Icon nome={skill} size={40} />
                        <p>{skill}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
