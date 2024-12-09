import { useEffect, useState } from "react";

// NOTE!: Using only HTML/CSS because this is used before everything is loaded
export default function LoadingScreen() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((dots) => {
        console.log(dots);
        if (dots.length >= 3) {
          return ".";
        }
        return dots + ".";
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#E6F0F0",
      }}
    >
      <h2>Loading map{dots}</h2>
    </div>
  );
}


