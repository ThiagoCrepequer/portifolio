import React from 'react'

export default function Icon({nome, size = 20}) {
  return <img src={`/assets/icons/${nome.toLowerCase()}.svg`} alt='icone' width={size} />
}
