import React from "react";

import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const keyboardLayout = {
  default: [
    "q w e r t y u i o p",
    "a s d f g h j k l",
    "enter z x c v b n m {bksp}",
  ],
};

const KeyboardMobile = ({ handleKeyDown }) => {
  return (
    <Keyboard onKeyPress={(e) => handleKeyDown(e)} layout={keyboardLayout} />
  );
};

export default KeyboardMobile;
