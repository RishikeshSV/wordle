import React, { useEffect, useState } from "react";

import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const keyboardLayout = {
  default: [
    "q w e r t y u i o p",
    "a s d f g h j k l",
    "enter z x c v b n m {bksp}",
  ],
};

const KeyboardMobile = ({ handleKeyDown, keyColors = [] }) => {
  const [keys, setKeys] = useState({ exists: [], incorrect: [], correct: [] });
  const [buttonTheme, setButtonTheme] = useState([]);

  useEffect(() => {
    if (keyColors.style?.length) {
      const newKeys = updateKeys(keyColors, keys);
      setKeys(newKeys);
    }
  }, [keyColors]);

  useEffect(() => {
    const tempButtonTheme = [];
    if (keys.exists.length) {
      tempButtonTheme.push({
        class: "hg-exists",
        buttons: keys.exists.join(" "),
      });
    }

    if (keys.incorrect.length) {
      tempButtonTheme.push({
        class: "hg-incorrect",
        buttons: keys.incorrect.join(" "),
      });
    }

    if (keys.correct.length) {
      tempButtonTheme.push({
        class: "hg-correct",
        buttons: keys.correct.join(" "),
      });
    }

    setButtonTheme(tempButtonTheme);
  }, [keys]);

  const updateKeys = (keyColors, keys) => {
    const { style, word } = keyColors;
    const temp = { correct: [], incorrect: [], exists: [] };

    word.forEach((letter, i) => {
      temp[style[i]].push(letter);
    });

    const newKeys = {
      exists: removeDuplicates([...keys.exists, ...temp.exists]),
      incorrect: removeDuplicates([...keys.incorrect, ...temp.incorrect]),
      correct: removeDuplicates([...keys.correct, ...temp.correct]),
    };

    //correct > incorrect > exists is the priority
    //if letter is in correct, then remove from incorrect and exists
    newKeys.correct.forEach((letter) => {
      newKeys.incorrect = removeItems(newKeys.incorrect, [letter]);
      newKeys.exists = removeItems(newKeys.exists, [letter]);
    });

    //if letter is in incorrect, then remove from exists
    newKeys.incorrect.forEach((letter) => {
      newKeys.exists = removeItems(newKeys.exists, [letter]);
    });

    return newKeys;
  };

  const removeDuplicates = (array) => [...new Set(array)];

  const removeItems = (sourceArray, itemsToRemove) =>
    sourceArray.filter((item) => !itemsToRemove.includes(item));

  return (
    <Keyboard
      onKeyPress={(e) => handleKeyDown(e)}
      layout={keyboardLayout}
      buttonTheme={buttonTheme}
    />
  );
};

export default KeyboardMobile;
