import { useEffect, useRef, useState } from "react";

export default function Timer({ questionId }) {

  const [time, setTime] = useState(10);
  const intervalRef = useRef(null);

  useEffect(() => {

    // reset timer
    setTime(10);

    // 🧹 clear previous interval FIRST
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // create new interval
    intervalRef.current = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // cleanup on unmount or question change
    return () => {
      clearInterval(intervalRef.current);
    };

  }, [questionId]);

  // return <h3>⏱ Time Left: {time}</h3>;
}