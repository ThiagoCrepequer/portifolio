import React from 'react'
import CheckBox from '../CheckBox'

export default function Stacks({ onClick, stacks }) {
    return (
        <li>
            <h3>Stacks</h3>
            <ul>
                {stacks.map((stack, index) => (
                    <li key={index}><CheckBox onClick={onClick} tipo={"stacks"} label={stack}/></li>
                ))}
            </ul>
        </li>
    )
}
