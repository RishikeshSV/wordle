import React, { useState, useRef, useEffect } from "react";
import "./App.css";

import axios from "axios";

import KeyboardMobile from "./KeyboardMobile";

const attempts = 5;

function App() {
  const [wordle, setWordle] = useState([]);
  const [wordleAttempt, setWordleAttempt] = useState({}); //going to be an object of arrays for each attempt
  const [currentAttempt, setCurrentAttempt] = useState(0); //to keep track of the attempt number

  const [gameOver, setGameOver] = useState(false);

  const stateRefs = useRef({ wordle, wordleAttempt, currentAttempt }); //required to keep ref to the latest attempt

  useEffect(() => {
    fetchWordle();
    window.addEventListener("keydown", handleKeyDown); //adding the window event listener on initial mount
    const temp = {};
    for (let i = 0; i < attempts; ++i) temp[i] = { word: [], style: [] };
    setWordleAttempt(temp); //creating empty wordleAttempt object {1: [{word: [], style: []}], 2: []...}
    return () => window.removeEventListener("keydown", handleKeyDown); //removing the window event listener on unmount
  }, []);

  const fetchWordle = async () => {
    const max = 7;
    const min = 1;
    const wordLength = Math.floor(Math.random() * (max - min + 1)) + min;
    const { data } = await axios.get(
      `https://random-word-api.herokuapp.com/word?length=${wordLength}`
    );
    console.log(data[0]);
    setWordle(data[0].split(""));
  };

  useEffect(() => {
    // Update the state refs whenever wordleAttempt or currentAttempt changes
    stateRefs.current.wordle = wordle;
    stateRefs.current.wordleAttempt = wordleAttempt[currentAttempt];
    stateRefs.current.currentAttempt = currentAttempt;
  }, [wordle, wordleAttempt, currentAttempt]);

  const handleKeyDown = (e) => {
    //eventListener creates a closure and will be registered with initial state values and won't use the updated values. So we require refs to use the updated values
    const { wordle, wordleAttempt, currentAttempt } = stateRefs.current; //getting current attempt
    const inputLetter = e.key || e;
    if (
      /^[a-z]$/.test(inputLetter) && //checking if key is a-z
      wordleAttempt.word.length < wordle.length //checking if we got the word length
    )
      setWordleAttempt((prev) => ({
        ...prev,
        [currentAttempt]: {
          style: [],
          word: [...wordleAttempt.word, inputLetter],
        },
      }));
    else if (
      (inputLetter === "Backspace" || inputLetter === "{bksp}") &&
      wordleAttempt.word.length >= 1
    )
      //if key is backspace and word length is not 0
      setWordleAttempt((prev) => ({
        ...prev,
        [currentAttempt]: { style: [], word: wordleAttempt.word.slice(0, -1) },
      }));
    else if (
      (inputLetter === "Enter" || inputLetter === "enter") &&
      wordleAttempt.word.length === wordle.length
    )
      //if key is enter and reached word length go to next attempt
      checkAttempt(currentAttempt, wordleAttempt, wordle);
  };

  const checkAttempt = (
    attempt = currentAttempt,
    word = wordleAttempt,
    wordle = wordle
  ) => {
    setCurrentAttempt(attempt + 1);
    word.word.map((letter, i) => {
      if (letter === wordle[i])
        word.style.push("correct"); //correct guess at correct position
      else if (wordle.includes(letter)) {
        const letterCountInWord = word.word.filter((l) => l === letter).length;
        const letterCountInWordle = wordle.filter((l) => l === letter).length;
        if (letterCountInWord <= letterCountInWordle)
          word.style.push("exists"); //correct guess at wrong position
        else word.style.push("incorrect"); //incorrect guess
      } else {
        word.style.push("incorrect"); //incorrect guess
      }
    });
    if (
      attempt + 1 >= attempts ||
      word.style.filter((a) => a === "correct").length === wordle.length
    ) {
      setGameOver(true);
      window.removeEventListener("keydown", handleKeyDown);
      return;
    }
  };

  return wordle.length ? (
    <React.Fragment>
      <div className="title" style={{ opacity: gameOver ? "0.5" : "1" }}>
        WORDLE
      </div>
      <div
        className="word-container"
        style={{ opacity: gameOver ? "0.5" : "1" }}
      >
        {[...Array(attempts)].map((attempt, index) => (
          <div className="word" key={`Attempt - ${index}`}>
            {wordle.map((letter, i) =>
              wordleAttempt[index] && wordleAttempt[index].word[i] ? (
                <div
                  key={`Letter - ${i}`}
                  className={
                    "letter-container " + wordleAttempt[index].style[i]
                  }
                >
                  {wordleAttempt[index].word[i].toUpperCase()}
                </div>
              ) : (
                <div key={`Letter - ${i}`} className="letter-container">
                  &nbsp;
                </div>
              )
            )}
          </div>
        ))}
      </div>
      <KeyboardMobile handleKeyDown={handleKeyDown} />
      {gameOver ? (
        <div className="reset-game" onClick={() => window.location.reload()}>
          PLAY NEW GAME
        </div>
      ) : null}
    </React.Fragment>
  ) : (
    <div style={{ color: "white" }}>...</div>
  );
}

export default App;
