import React from 'react'
import CheckBox from '../CheckBox'
import Icon from 'Components/Icon'

export default function Tecnologias({ tecnologias, onClick }) {
    return (
        <li>
            <h3>Linguagens</h3>
            <ul>
                {tecnologias.map(tecno => (
                    <li key={tecno}>
                        <CheckBox tipo={"tecnologias"} onClick={onClick} label={tecno}>
                            <Icon nome={tecno} />
                        </CheckBox>
                    </li>
                ))}

            </ul>
        </li>
    )
}
