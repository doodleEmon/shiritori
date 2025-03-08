import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [currentWord, setCorrentWord] = useState("");
  const [lastLetter, setLastLetter] = useState(null);
  const [turn, setTurn] = useState("Player-1");
  const [wordHistory, setWordHistory] = useState([]);
  const [scores, setScores] = useState({ "Player-1": 0, "Player-2": 0 });
  const [timer, setTimer] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      handleInvalidWord();
    }
  }, [timer, gameOver]);

  const validateWord = async (word) => {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if(res.status === 404) {
      alert("Word is invalid!");
    }
    return res.ok;
  };

  const handleInvalidWord = () => {
    setScores((prev) => ({ ...prev, [turn]: prev[turn] - 1 }));
    switchTurn();
  };

  const switchTurn = () => {
    setTurn(turn === "Player-1" ? "Player-2" : "Player-1");
    setTimer(10);
  };

  const handleWordSubmit = async () => {
    if (gameOver) return;
    if (
      currentWord.length < 4 ||
      (lastLetter && currentWord[0] !== lastLetter) ||
      wordHistory.includes(currentWord)
    ) {
      handleInvalidWord();
    } else if (await validateWord(currentWord)) {
      setWordHistory([...wordHistory, currentWord]);
      setLastLetter(currentWord.slice(-1));
      setScores((prev) => ({ ...prev, [turn]: prev[turn] + 1 }));
      switchTurn();
    } else {
      handleInvalidWord();
    }
    setCorrentWord("");
    checkGameOver();
  };

  const checkGameOver = () => {
    if (scores["Player-1"] <= -3 || scores["Player-2" <= -3]) {
      setGameOver(true);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h3 className="text-3xl">Hello shiritori.</h3>
      {gameOver ? (
        <h2>
          Game over!{" "}
          {scores["Player-1"] > scores["Player-2"]
            ? "Player-1 wins!"
            : "Player-2 wins!"}
        </h2>
      ) : (
        <>
          <p>Current turn: {turn}</p>
          <p>Time left: {timer}s</p>
          <input
            onChange={(e) => setCorrentWord(e.target.value)}
            value={currentWord}
            type="text"
            className="border p-2 w-full"
            name=""
            id=""
          />
          <button
            className="bg-blue-400 text-white p-2 rounded"
            onClick={handleWordSubmit}
          >
            Submit
          </button>
          <h2 className="text-lg font-semibold">Word history</h2>
          <ul>
            {wordHistory.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
          <h2 className="text-lg font-semibold">Scores</h2>
          <p>Player 1: {scores["Player-1"]}</p>
          <p>Player 2: {scores["Player-1"]}</p>
        </>
      )}
    </div>
  );
};

export default App;
