import { useEffect, useState } from "react";

export default function CountdownTimer({ seconds }) {
  const [time, setTime] = useState(seconds || 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{fontSize:"20px",fontWeight:"bold"}}>
      ⏳ Auction Ends In: {time}s
    </div>
  );
}