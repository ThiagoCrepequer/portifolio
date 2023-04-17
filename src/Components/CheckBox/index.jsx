import React from 'react'

export default function CheckBox({label, onClick, tipo, children}) {
    return (
        <label>
            <input type='checkbox' onClick={onClick} title={label} placeholder={tipo}/>
            {children}
            {label}
        </label>
    )
}
