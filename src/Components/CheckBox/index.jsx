import React from 'react'

export default function CheckBox({children, onClick, tipo}) {
    return (
        <>
            <input type='checkbox' onClick={onClick} title={children} tipo={tipo}/>
            <label>{children}</label>
        </>
    )
}
