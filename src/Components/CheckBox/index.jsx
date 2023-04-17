import React from 'react'

export default function CheckBox({children, onClick}) {
    return (
        <>
            <input type='checkbox' onClick={onClick}/>
            <label>{children}</label>
        </>
    )
}
