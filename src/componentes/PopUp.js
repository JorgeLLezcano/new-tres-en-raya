import React from 'react';

export function PopUp({ winner, onReset, handleContinua }) {
  return (
    <div className="popUp">
      {!winner ? <h1>Empate !!!</h1> : <h1>El ganador es {winner}</h1>}
      <button className="btnReincio" onClick={onReset}>
        Reinicio
      </button>
      <button className="btn-continuar" onClick={handleContinua}>
        {' '}
        Continuar
      </button>
    </div>
  );
}
