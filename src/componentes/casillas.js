import React from 'react'


export function Casillas({block, index, handlrClick, winner }){

  return(
    <div
            key={index}
            className="block"
            style={{ backgroundColor: block ? 'grey' : '' }}
            onClick={() => handlrClick(index)}
          >
            <div className="pieza" style={{ }}>{block}</div>
          </div>
  )
}