import React from 'react';
import './style.css';
import { useState, useEffect } from 'react';
import conffeti from 'canvas-confetti';
import { Menu } from '././componentes/Menu.js';
import { PopUp } from './componentes/PopUp.js';
import { Counter } from './componentes/Counter.js';
import { Casillas } from './componentes/casillas.js';
import { TURN, winningConditions } from './constants.js';

export default function App() {
  const [bloque, setBloque] = useState(
    JSON.parse(localStorage.getItem('bloque')) || Array(9).fill(null)
  );
  const [turn, setTurn] = useState(localStorage.getItem('turn') || TURN.X);
  const [winner, setWinner] = useState(null);
  const [countX, setCountX] = useState(0);
  const [countO, setCountO] = useState(0);
  const [gameMode, setGameMode] = useState(null);
  const saveToLocalStorage = () => {
    localStorage.setItem('bloque', JSON.stringify(bloque));
    localStorage.setItem('turn', turn);
  };

  function checkWinner(newBloque) {
    for (const condition of winningConditions) {
      const [a, b, c] = condition;
      if (
        newBloque[a] &&
        newBloque[a] === newBloque[b] &&
        newBloque[a] === newBloque[c]
      ) {
        return newBloque[a]; // Retorna el ganador ('X' o 'O')
      }
    }
    if (newBloque.every((el) => el)) {
      return null; // Si todas las casillas están llenas, hay empate
    }
    return null; // Si no hay ganador, retorna null
  }

  function handleReset() {
    setBloque(Array(9).fill(null));
    setWinner(null);
    setCountO(0);
    setCountX(0);
    localStorage.removeItem('bloque');
    localStorage.removeItem('turn');
    winner === TURN.X ? setTurn(TURN.X) : setTurn(TURN.O);
    setGameMode(null);
  }

  function handleContinua() {
    setBloque(Array(9).fill(null));
    setWinner(null);
    winner === TURN.X ? setTurn(TURN.X) : setTurn(TURN.O);
    saveToLocalStorage();
  }

  function jugadaPC() {
    if (
      gameMode === 'solo, vs PC' &&
      turn === TURN.O &&
      !winner &&
      !bloque.every((el) => el)
    ) {
      let bestScore = -Infinity;
      let move;

      // Escanear el tablero y evaluar posibles movimientos
      for (let i = 0; i < bloque.length; i++) {
        if (!bloque[i]) {
          // Simular movimiento
          const newBloque = [...bloque];
          newBloque[i] = TURN.O;

          // Evaluar el tablero resultante
          const score = minimax(newBloque, 0, false);

          // Seleccionar la mejor jugada
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }
      const newBloque = [...bloque];
      newBloque[move] = TURN.O;
      // Realizar la mejor jugada
      setBloque(newBloque);
    
      // Verificar si hay ganador después de la jugada
      const newWinner = checkWinner(newBloque);

      if (newWinner === TURN.O) {
        setWinner(TURN.O);
        setCountO(countO + 1);
        return;
      }
      setTurn(TURN.X);
    }
    
  }

  function minimax(newBloque, depth, isMaximizing) {
    const result = checkWinner(newBloque);
    if (result !== null) {
      // Si hay un ganador o empate, retornar el puntaje
      return result === TURN.O ? 10 - depth : depth - 10;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < newBloque.length; i++) {
        if (!newBloque[i]) {
          const cloneBloque = [...newBloque];
          cloneBloque[i] = TURN.O;
          const score = minimax(cloneBloque, depth + 1, false);
          bestScore = Math.max(bestScore, score);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < newBloque.length; i++) {
        if (!newBloque[i]) {
          const cloneBloque = [...newBloque];
          cloneBloque[i] = TURN.X;
          const score = minimax(cloneBloque, depth + 1, true);
          bestScore = Math.min(bestScore, score);
        }
      }
      return bestScore;
    }
  }

  useEffect(() => {
    // La PC juega automáticamente cuando es su turno
    if (gameMode === 'solo, vs PC' && turn === TURN.O) {
      jugadaPC();
    }
  }, [turn, winner]);

  function handlrClick(index) {
    event.preventDefault();
    // setWinner(null);
  
    const winner = checkWinner(bloque)
    if (winner || bloque[index])return;
   
    const newBloque = [...bloque];
    newBloque[index] = turn;

    setBloque((newBloque) =>
      newBloque.map((item, i) => (i === index ? turn : item))
    );

    const newWinner = checkWinner(newBloque);

    if (newWinner) {
      // Si hay un ganador, suma los puntos y muestra el popup
      if (newWinner === TURN.O) {
        setCountO(countO + 1); // Sumar punto para la computadora
      } else if (newWinner === TURN.X) {
        setCountX(countX + 1); // Sumar punto para el jugador
      }

      // Si hay ganador, muestra un mensaje o realiza la acción que desees
      conffeti();
      setWinner(newWinner);
      saveToLocalStorage();
      return;
    } else if (newBloque.every((el) => el)) {
      // Si hay empate, muestra un mensaje
      saveToLocalStorage();
    } else {
      // Si no hay ganador, cambia la jugada para la próxima ronda
      const newTurn = turn === TURN.X ? TURN.O : TURN.X;
      setTurn(newTurn);
      saveToLocalStorage();
    }
  }
  jugadaPC();

  return (
    <>
      {gameMode ? null : <Menu setGameMode={setGameMode} />}

      {winner && (
        <PopUp
          winner={winner}
          onReset={handleReset}
          handleContinua={handleContinua}
        />
      )}
      {bloque.every((el) => el) && (
        <PopUp
          winner={winner}
          onReset={handleReset}
          handleContinua={handleContinua}
        />
      )}
      <Counter countX={countX} countO={countO} />
      <h1> TA TE TI </h1>
      <div className="bloques">
        {bloque.map((block, index) => (
          <Casillas
            block={block}
            index={index}
            key={index}
            handlrClick={handlrClick}
            winner={winner}
          />
        ))}
 
      </div>
  <div className='conteiner-line'>
  <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <line x1="430" y1="532" x2="426" y2="100" stroke="#70AEDB" stroke-width="25"/>
  <line x1="500" y1="480" x2="40" y2="480" stroke="#70AEDB" stroke-width="25"/>
  <line x1="50" y1="170" x2="500" y2="160" stroke="#70AEDB" stroke-width="25"/>
  <line x1="430" y1="532" x2="426" y2="100" stroke="#70AEDB" stroke-width="25"/>
  <line x1="430" y1="532" x2="426" y2="100" stroke="#70AEDB" stroke-width="25"/>
  <line x1="430" y1="532" x2="426" y2="100" stroke="#70AEDB" stroke-width="25"/>
  <line x1="430" y1="532" x2="426" y2="100" stroke="#70AEDB" stroke-width="25"/>
  <line x1="430" y1="532" x2="426" y2="100" stroke="#70AEDB" stroke-width="25"/>
</svg>
  </div>
      <h1> Turno : {turn} </h1>
      <button className="btnReincio" onClick={handleReset}>
        Reinicio
      </button>
 
    </>
  );
}
