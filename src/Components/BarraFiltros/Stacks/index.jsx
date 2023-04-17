import React from 'react'
import CheckBox from '../../CheckBox'

export default function Stacks({onClick}) {
    return (
        <li>
            <h3>Stacks</h3>
            <ul>
                <li><CheckBox onClick={onClick} tipo={"stacks"}>Front-End</CheckBox></li>
                <li><CheckBox onClick={onClick} tipo={"stacks"}>Back-End</CheckBox></li>
            </ul>
        </li>
    )
}
