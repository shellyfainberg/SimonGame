//Frontend
import { Fragment, useCallback, useEffect, useState } from "react";
import Button from "./components/Button";
import ColorCard from "./components/ColorCard";
import Welcome from "./components/Welcome";
import timeout from "./utils/util";
import "./App.scss";

import redSoundFile from "./sounds/simonSound1.mp3";
import greenSoundFile from "./sounds/simonSound2.mp3";
import blueSoundFile from "./sounds/simonSound3.mp3";
import yellowSoundFile from "./sounds/simonSound4.mp3";

const App = () => {
  const [startGame, setStartGame] = useState(false);
  const [isOn, setIsOn] = useState(false);

  const colorList = ["red", "green", "blue", "yellow"];

  const [soundObj] = useState({
    red: new Audio(redSoundFile),
    green: new Audio(greenSoundFile),
    blue: new Audio(blueSoundFile),
    yellow: new Audio(yellowSoundFile),
  });

  const initPlay = {
    isDisplay: false,
    colors: [],
    score: 0,
    userPlay: false,
    userColors: [],
  };
  const [play, setPlay] = useState(initPlay);
  const [flashColor, setFlashColor] = useState("");
  const [highScore, setHighScore] = useState(0);

  const generateUserId = () => {
    if (!localStorage.getItem("userId")) {
      const id =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem("userId", id);
    }
    return localStorage.getItem("userId");
  };

  const submitScore = () => {
    const userId = generateUserId();
    fetch(`http://localhost:5000/api/status/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: play.score,
        steps: play.colors,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        play.score = res.score;
        play.colors = res.colors;
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    soundObj[flashColor] && soundObj[flashColor].play();
  }, [flashColor]);

  const startHandle = () => {
    setIsOn(true);
  };

  useEffect(() => {
    const userId = generateUserId();
    fetch(`http://localhost:5000/api/status/${userId}`)
      .then((response) => response.json())
      .then((res) => {
        setHighScore(res[0].highScore);
        console.log(res[0].highScore);
      })
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
    displayColors();
  }, [play.colors.length]);

  const displayColors = useCallback(async () => {
    if (!play.isDisplay) {
      return;
    }
    for (let i = 0; i < play.colors.length; i++) {
      await timeout(1000);
      console.log("play.colors:", play.colors);
      setFlashColor(play.colors[i]);
      await timeout(1000);
      setFlashColor("");
    }

    await timeout(1000);
    const copyColors = [...play.colors];
    setPlay({
      ...play,
      isDisplay: false,
      userPlay: true,
      userColors: copyColors.reverse(),
    });
  }, [play.colors.length, play.isDisplay]);

  const cardClickHandle = async (color) => {
    if (!play.isDisplay && play.userPlay) {
      const copyUserColors = [...play.userColors];
      const lastColor = copyUserColors.pop(); // remove the last from the array

      setFlashColor(color);

      if (color === lastColor) {
        if (copyUserColors.length) {
          setPlay({ ...play, userColors: copyUserColors });
        } else {
          await timeout(1000);
          setPlay({
            ...play,
            isDisplay: true,
            userPlay: false,
            score: play.colors.length,
            userColors: [],
          });
        }
      } else {
        await timeout(1000);
        setPlay({ ...initPlay, score: play.colors.length - 1 });
        submitScore();
      }
      await timeout(1000);
      setFlashColor("");
    }
  };

  const closeHandle = () => {
    setIsOn(false);
  };

  return (
    <Fragment>
      {!startGame && (
        <Welcome onClick={() => setStartGame((prevState) => !prevState)} />
      )}

      {startGame && (
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
            {!isOn && !play.score && (
              <Button onClick={startHandle} text="START" />
            )}
            {isOn && (play.isDisplay || play.userPlay) && (
              <div className="score">{play.score}</div>
            )}

            {isOn && !play.isDisplay && !play.userPlay && play.score && (
              <div className="lost">
                <div className="score">Score:{play.score}</div>
                <Button onClick={closeHandle} text="CLOSE" />
              </div>
            )}
          </div>
          <div className="highScoreWrapper">
            <h1>Highest:{highScore}</h1>
          </div>
          <div className="turnWrapper">
            {isOn && <h1>{play.isDisplay ? "Computer Turn" : "Your Turn"}</h1>}
          </div>
          <div className="quit">
            <Button
              className="button"
              text="QUIT"
              onClick={() => setStartGame((prevState) => !prevState)}
            ></Button>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default App;
