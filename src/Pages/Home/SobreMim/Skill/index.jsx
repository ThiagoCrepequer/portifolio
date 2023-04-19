import React from 'react'
import styles from './Skill.module.scss'
import Icon from 'Components/Icon'

export default function Skill({ value }) {
    return (
        <div className={styles.skill}>
            <Icon nome={value} size={40}/>
            <p>{value}</p>
        </div>
    )
}
