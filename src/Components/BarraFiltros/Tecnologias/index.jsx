import React from 'react'
import CheckBox from '../../CheckBox'

export default function Tecnologias({ tecnologias, onClick }) {
    return (
        <li>
            <h3>Linguagens</h3>
            <ul>
                {tecnologias.map(tecno => (
                    <li key={tecno}>
                        <CheckBox tipo={"tecnologias"} onClick={onClick} label={tecno.slice(0, 1).toUpperCase() + tecno.slice(1)}>
                            <img src={`/assets/icons/${tecno}.svg`} alt='icone' width={20} />
                        </CheckBox>
                    </li>
                ))}

            </ul>
        </li>
    )
}
