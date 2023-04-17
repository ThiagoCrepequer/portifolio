import React from 'react'
import CheckBox from '../../CheckBox'

export default function Stacks({ onClick, stacks }) {
    return (
        <li>
            <h3>Stacks</h3>
            <ul>
                {stacks.map(stack => (
                    <li><CheckBox onClick={onClick} tipo={"stacks"} label={stack.slice(0, 1).toUpperCase() + stack.slice(1)} /></li>
                ))}
            </ul>
        </li>
    )
}
