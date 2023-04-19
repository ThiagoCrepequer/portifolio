import Section from 'Components/Section'
import SubTitulo from 'Components/SubTitulo'
import Titulo from 'Components/Titulo'
import { getHeight } from 'assets/js/getHeight'
import React from 'react'

export default function Contatos() {
    return (
        <Section >
            <div style={{ height: getHeight() }}>
                <Titulo>Contatos</Titulo>
                <div className=''>
                    <SubTitulo>Redes Sociais</SubTitulo>
                    
                </div>
            </div>
        </Section>
    )
}
