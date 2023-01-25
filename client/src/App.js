//Frontend
import { useEffect, useState } from "react";
import "./App.scss";
import Button from "./components/Button";
import ColorCard from "./components/ColorCard";
import timeout from "./utils/util";

const App = () => {
  const [isOn, setIsOn] = useState(false);
  const colorList = ["red", "green", "blue", "yellow"];

  const initPlay = {
    isDisplay: false,
    colors: [],
    score: 0,
    userPlay: false,
    userColors: [],
  };
  const [play, setPlay] = useState(initPlay);
  const [flashColor, setFlashColor] = useState("");
  const [highScore, setHighScore] = useState(() => {
    const highScoreFromStorage = localStorage.getItem("highScore");
    if (highScoreFromStorage) {
      return highScoreFromStorage;
    }
    return 0;
  });

  const startHandle = () => {
    setIsOn(true);
  };

  useEffect(() => {
    fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isOn }),
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
  }, [isOn]);

  useEffect(() => {
    if (isOn) {
      setPlay({ ...initPlay, isDisplay: true });
    } else {
      setPlay(initPlay);
    }
  }, [isOn]);

  useEffect(() => {
    if (isOn && play.isDisplay) {
      let newColor = colorList[Math.floor(Math.random() * 4)];
      let copyColors = [...play.colors];
      copyColors.push(newColor);
      setPlay({ ...play, colors: copyColors });
    }
  }, [isOn, play.isDisplay]);

  useEffect(() => {
    if (isOn && play.isDisplay && play.colors.length) {
      displayColors();
    }
  }, [isOn, play.isDisplay, play.colors.length]);

  const displayColors = async () => {
    await timeout(700);
    for (let i = 0; i < play.colors.length; i++) {
      setFlashColor(play.colors[i]);
      await timeout(700);
      setFlashColor("");
      await timeout(700);

      if (i === play.colors.length - 1) { // last color
        const copyColors = [...play.colors];
        setPlay({
          ...play,
          isDisplay: false,
          userPlay: true,
          userColors: copyColors.reverse(),
        });
      }
    }
  };

  const cardClickHandle = async (color) => {
    
    if (!play.isDisplay && play.userPlay) {
      const copyUserColors = [...play.userColors];
      const lastColor = copyUserColors.pop(); // remove the last from the array

      setFlashColor(color);

      if (color === lastColor) {
        if (copyUserColors.length) {
          setPlay({ ...play, userColors: copyUserColors });
        } else {
          await timeout(700);
          setPlay({
            ...play,
            isDisplay: true,
            userPlay: false,
            score: play.colors.length,
            userColors: [],
          });
        }
      } else {
        await timeout(700);
        setPlay({ ...initPlay, score: play.colors.length });
      }
      await timeout(700);
      setFlashColor("");
    }
  };
  const closeHandle = () => {
    setIsOn(false);
    const highScore = localStorage.getItem("highScore");
    if (!highScore || play.score - 1 > highScore) {
      console.log("play.score - 1 ",play.score - 1 )
      setHighScore(play.score - 1);
      localStorage.setItem("highScore", JSON.stringify(play.score - 1));
    }
  };

  return (
    <div className="App">
      <div className="cardWarpper">
        {colorList &&
          colorList.map((color, index) => (
            <ColorCard
              key={index}
              color={color}
              flash={flashColor === color}
              onClick={() => {
                cardClickHandle(color);
              }}
            ></ColorCard>
          ))}
      </div>

      <div className="centerWrapper">
        {!isOn && <h1 className="simon">SIMON</h1>}
        {!isOn && !play.score && <Button onClick={startHandle} text="Start" />}
        {isOn && (play.isDisplay || play.userPlay) && (
          <div className="score">{play.score}</div>
        )}

        {isOn && !play.isDisplay && !play.userPlay && play.score && (
          <div className="lost">
            <div className="score">Score:{play.score - 1}</div>
            <Button onClick={closeHandle} text="Close" />
          </div>
        )}
      </div>
      <div className="highScoreWrapper">
      <h1>Highest:{highScore}</h1>
      </div>
    </div>
  );
};

export default App;
