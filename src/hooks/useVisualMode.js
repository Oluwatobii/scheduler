import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // Creating a function that will take in a new mode and update the mode state with the new value.
  function transition(newMode, replace = false) {
    if (replace) {
      const newHistory = [...history];
      newHistory[newHistory.length - 1] = newMode;
      setHistory(newHistory);
    } else {
      setHistory((history) => [...history, newMode]);
    }
    setMode(newMode);
  }

  //A function to go back to the previous mode if the history is not in it's initial state
  function back() {
    console.log("BACK!!!");
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setMode(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  }

  return { mode, transition, back };
}
