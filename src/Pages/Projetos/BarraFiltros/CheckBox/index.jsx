import React from 'react'
import styles from './CheckBox.module.scss'

export default function CheckBox({label, onClick, tipo, children}) {
    return (
        <label className={styles.label}>
            <input type='checkbox' onClick={onClick} title={label} placeholder={tipo}/>
            {children}
            {label}
        </label>
    )
}
