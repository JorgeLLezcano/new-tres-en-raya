import React from 'react';

export function Menu({ setGameMode }) {
  function handleModeClick(mode) {
    setGameMode(mode);
  }

  return (
    <secction className="menu">
      <h1>Bienvenido al juego</h1>
      <div class="conteiner">
  <div class="cubo">
    <div class="title1">❌ ⚪</div>
  <div class="title2"> TRES EN RAYA </div>
  <div class="title3">TA TE TI</div>
  <div class="title4"> TI TAC TOE</div>
  </div>
</div>
      <p>te gustaria jugar con un oponente o con la pc? </p>
      <button
        className="btn-ponente"
        onClick={() => handleModeClick('2 jugadores')}
      >
        {' '}
        2 Jugadores 🤜🏽🤛🏽
      </button>
      <button className="btn-pc" onClick={() => handleModeClick('solo, vs PC')}>
        {' '}
        Solo, vs PC 🦾
      </button>
    </secction>
  );
}
