import React from 'react'
import CheckBox from '../../CheckBox'

export default function Tecnologias({ tecnologias }) {
    return (
        <li>
            <h3>Linguagens</h3>
            <ul>
                {tecnologias.map(stack => (
                    <li key={stack}>
                        <CheckBox tipo={"tecnologias"}>
                            <img src={`/assets/icons/${stack}.svg`} alt='icone' width={20} />
                            {stack.slice(0, 1).toUpperCase() + stack.slice(1)}
                        </CheckBox>
                    </li>
                ))}

            </ul>
        </li>
    )
}
