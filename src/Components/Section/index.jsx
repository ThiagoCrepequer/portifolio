import React from 'react'
import styles from './Section.module.scss'

export default function Section({ children, background, className }) {


    return (
        <div className={`${styles.section} ${className}`} style={{ background: background }}>
            {children}
        </div>
    )
}
