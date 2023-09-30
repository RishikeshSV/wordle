import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const attempts = 6;
const wordle = ["s", "t", "u", "n"];

function App() {
  const [wordleAttempt, setWordleAttempt] = useState({}); //going to be an object of arrays for each attempt
  const [currentAttempt, setCurrentAttempt] = useState(0); //to keep track of the attempt number

  const stateRefs = useRef({ wordleAttempt, currentAttempt }); //required to keep ref to the latest attempt

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown); //adding the window event listener on initial mount
    const temp = {};
    for (let i = 0; i < attempts; ++i) temp[i] = { word: [], style: [] };
    setWordleAttempt(temp); //creating empty wordleAttempt object {1: [{word: [], style: []}], 2: []...}
    return () => window.removeEventListener("keydown", handleKeyDown); //removing the window event listener on unmount
  }, []);

  useEffect(() => {
    // Update the state refs whenever wordleAttempt or currentAttempt changes
    stateRefs.current.wordleAttempt = wordleAttempt[currentAttempt];
    stateRefs.current.currentAttempt = currentAttempt;
  }, [wordleAttempt, currentAttempt]);

  const handleKeyDown = (e) => {
    //eventListener creates a closure and will be registered with initial state values and won't use the updated values. So we require refs to use the updated values
    const { wordleAttempt, currentAttempt } = stateRefs.current; //getting current attempt
    if (
      /^[a-z]$/.test(e.key) && //checking if key is a-z
      wordleAttempt.word.length < wordle.length //checking if we got the word length
    )
      setWordleAttempt((prev) => ({
        ...prev,
        [currentAttempt]: { style: [], word: [...wordleAttempt.word, e.key] },
      }));
    else if (e.key === "Backspace" && wordleAttempt.word.length >= 1)
      //if key is backspace and word length is not 0
      setWordleAttempt((prev) => ({
        ...prev,
        [currentAttempt]: { style: [], word: wordleAttempt.word.slice(0, -1) },
      }));
    else if (e.key === "Enter" && wordleAttempt.word.length === wordle.length)
      //if key is enter and reached word length go to next attempt
      checkAttempt(currentAttempt, wordleAttempt);
  };

  const checkAttempt = (attempt = currentAttempt, word = wordleAttempt) => {
    word.word.map((letter, i) => {
      if (letter === wordle[i]) word.style.push("correct");
      else if (wordle.includes(letter)) word.style.push("exists");
      else word.style.push("incorrect");
    });
    setCurrentAttempt(attempt + 1);
  };

  return (
    <div className="word-container">
      {[...Array(attempts)].map((attempt, index) => (
        <div className="word" key={`Attempt - ${index}`}>
          {wordle.map((letter, i) => (
            <div key={`Letter - ${i}`} className="letter-container">
              {wordleAttempt[index] && wordleAttempt[index].word[i] ? (
                <div className={"letter " + wordleAttempt[index].style[i]}>
                  {wordleAttempt[index].word[i].toUpperCase()}
                </div>
              ) : (
                <div className="blank">&nbsp;</div>
              )}
            </div>
          ))}
        </div>
      ))}
      {/* <button className="submit" onClick={() => checkAttempt()}>
        SUBMIT
      </button>
      <button className="delete">DELETE</button> */}
    </div>
  );
}

export default App;
