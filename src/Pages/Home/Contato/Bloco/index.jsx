import React from 'react'
import styles from './Bloco.module.scss'

export default function Bloco({children}) {
    return (
        <div className={styles.bloco}>
            <div className={styles.bloco__backgroundIcone}>
                {children[0]}
            </div>
            {[
                children[1],
                children[2]
            ]}
        </div>
    )
}

export function Icone({children}) {
    return children
}