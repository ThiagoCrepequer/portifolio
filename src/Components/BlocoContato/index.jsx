import React from 'react'
import styles from './Bloco.module.scss'

export default function BlocoContato({ children, icone = false }) {

    return (
        <div className={styles.bloco}>
            {icone === false ?
                <>
                    <div className={styles.bloco__backgroundIcone}>
                        {children[0]}
                    </div>
                    {children.slice(1).map(element => {
                        return element
                    })}
                </>
                : children}
        </div>
    )
}

export function Icone({ children }) {
    return children
}