import React from 'react';

export function Counter({ countX, countO }) {
  return (
    <div className="contador">
      <h1>Jugador ❌: {countX}</h1>
      <h1>Jugador ⚪: {countO} </h1>
    </div>
  );
}