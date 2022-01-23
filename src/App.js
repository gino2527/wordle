import { useState } from 'react';

const LETTER_ONLY_REGEX = /^[a-zA-z]{1}$/;

const processGuess = (wLetters, guessLetters) => {
  const guessLettersShaped = guessLetters.map((letter) => ({
    color: 'grey',
    letter: letter.toLowerCase(),
  }));
  let correctCount = 0;

  const wordLetters = [...wLetters].map((l, i) => {
    const isMatched = l === guessLetters[i].toLowerCase();

    if (isMatched) {
      guessLettersShaped[i].color = 'green';
      correctCount++;
    }

    return isMatched  ? '*' : l;
  });
  const result = guessLettersShaped.map((lS) => {
    const { color, letter } = lS;

    if (
      color !== 'green'
        && wordLetters.includes(letter)
    ) {
      const indexInWord = wordLetters.indexOf(letter);
      wordLetters[indexInWord] = '*';
      return {...lS, color: 'yellow'};
    }

    return lS;
  });

  return {
    isGuessed: wLetters.length === correctCount,
    result,
  };
};

function App() {
  const [guess, setGuess] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [isGuessed, setIsGuessed] = useState(false);
  const [word] = useState([...'crimp'].map((l) => l.toLowerCase()));

  const handleChange = (e, index) => {
    const { target } = e;
    const { value } = target;

    const currChar = guess[index];
    const newChar = (
      currChar !== '-'
        ? value.replace(currChar, '')
        : value
    );

    if (LETTER_ONLY_REGEX.test(newChar) || !newChar) {
      const newGuess = [...guess];
      newGuess[index] = newChar.toUpperCase();

      setGuess(newGuess);
      if (newChar) {
        if (index < 4) target.nextElementSibling.focus();
        else target.blur();
      } else if (index > 0) target.previousElementSibling.focus();
    }
  }

  const handleSubmit = () => {
    const { isGuessed, result } = processGuess(word, [...guess]);

    setIsGuessed(isGuessed);
    setGuesses((v) => [...v, result]);
    setGuess([]);
  }

  return (
    <div className="App">
      <div className="guesses">
        {guesses.map((g, gIndex) => (
          <div
            className="guess"
            key={`word-${gIndex + 1}`}
          >
            {g.map(({ color, letter }, lIndex) => (
              <input
                className={`guess--letter guess--letter__${color}`}
                disabled
                key={`guess-${gIndex + 1}-letter-${lIndex + 1}`}
                value={letter.toUpperCase()}
              />
            ))}
          </div>
        ))}
        {!isGuessed && (
          <>
            <div className="guess">
              {Array.from(Array(word.length)).map((_, lIndex) => (
                <input
                  className="guess--letter"
                  key={`letter-${lIndex + 1}`}
                  onChange={(e) => handleChange(e, lIndex)}
                  value={guess[lIndex] || ''}
                />
              ))}
            </div>
            {guess.filter((v) => v).length === word.length && (
              <div>
                <button
                  onClick={handleSubmit}
                  type="button"
                >
                  Enter
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
