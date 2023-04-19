import React from 'react'

export default function Icon({nome, size = 20, pasta = "linguagens"}) {
  return <img src={`/assets/icons/${pasta}/${nome.toLowerCase()}.svg`} alt='icone' width={size} />
}
