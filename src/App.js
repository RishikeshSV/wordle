import React, { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

const attempts = 6;

function App() {
  const [wordle, setWordle] = useState(["s", "t", "u", "n"]);
  const [wordleAttempt, setWordleAttempt] = useState({}); //going to be an object of arrays for each attempt
  const [currentAttempt, setCurrentAttempt] = useState(0); //to keep track of the attempt number

  const stateRefs = useRef({ wordleAttempt, currentAttempt }); //required to keep ref to the latest attempt

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown); //adding the window event listener on initial mount
    const temp = {};
    for (let i = 0; i < attempts; ++i) temp[i] = [];
    setWordleAttempt(temp); //creating empty wordleAttempt object {1: [], 2: []...}
    return () => window.removeEventListener("keydown", handleKeyDown); //removing the window event listener on unmount
  }, []);

  const handleKeyDown = (e) => {
    const { wordleAttempt, currentAttempt } = stateRefs.current; //getting current attempt
    if (
      /^[a-z]$/.test(e.key) && //checking if key is a-z
      wordleAttempt.length < wordle.length //checking if we got the word length
    )
      setWordleAttempt((prev) => ({
        ...prev,
        [currentAttempt]: [...wordleAttempt, e.key],
      }));
  };

  useEffect(() => {
    // Update the state refs whenever wordleAttempt or currentAttempt changes
    stateRefs.current.wordleAttempt = wordleAttempt[currentAttempt];
    stateRefs.current.currentAttempt = currentAttempt;
  }, [wordleAttempt, currentAttempt]);

  const checkAttempt = () => {
    setCurrentAttempt(currentAttempt + 1);
  };

  return (
    <div className="word-container">
      {[...Array(attempts)].map((attempt, index) => (
        <div className="word" key={`Attempt - ${index}`}>
          {wordle.map((letter, i) => (
            <div key={`Letter - ${i}`} className="letter-container">
              {wordleAttempt[index] && wordleAttempt[index][i] ? (
                <div className="letter">
                  {wordleAttempt[index][i].toUpperCase()}
                </div>
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
