import { useState, useEffect } from 'react';

export function useCountdown(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(initialSeconds > 0);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const reset = (newSeconds = initialSeconds) => {
    setSeconds(newSeconds);
    setIsActive(newSeconds > 0);
  };

  return {
    seconds,
    isDone: seconds === 0,
    reset,
    isActive,
  };
}
