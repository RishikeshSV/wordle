import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [wordle, setWordle] = useState(["s", "t", "u", "n"]);
  const [wordleAttempt, setWordleAttempt] = useState([]);
  const [attempts, setAttempts] = useState(6);

  const latestWordleAttempt = useRef(wordleAttempt);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (e) => {
    if (
      /^[a-z]$/.test(e.key) &&
      latestWordleAttempt.current.length < wordle.length
    )
      setWordleAttempt((prev) => [...prev, e.key]);
  };

  useEffect(() => {
    // Update the ref whenever wordleAttempt changes
    latestWordleAttempt.current = wordleAttempt;
  }, [wordleAttempt]);

  const checkAttempt = () => console.log("TRY NEXT ATTEMPT");

  return (
    <div className="word-container">
      {[...Array(attempts)].map((attempt, index) => (
        <div className="word" key={`Attempt - ${index}`}>
          {wordle.map((letter, i) => (
            <div
              key={`Letter - ${i}`}
              // className={wordleAttempt[i] ? "letter" : "blank"}
            >
              {wordleAttempt[i] ? (
                <div className="letter">{wordleAttempt[i].toUpperCase()}</div>
              ) : (
                <div className="blank">&nbsp;</div>
              )}
            </div>
          ))}
        </div>
      ))}
      <button className="submit" onClick={() => checkAttempt()}>
        SUBMIT
      </button>
      <button className="delete">DELETE</button>
    </div>
  );
}

export default App;
