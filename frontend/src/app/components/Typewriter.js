import React, { useState, useEffect } from 'react';

function Typewriter({ text, speed = 50 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prevText => prevText + text[index]);
        setIndex(prevIndex => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [text, index, speed]);

  return <span>{displayedText}</span>;
}

export default Typewriter;