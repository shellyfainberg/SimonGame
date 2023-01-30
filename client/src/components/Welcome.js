import { ReactComponent as SimonIcon } from "../assets/simon.svg";
import Button from "./Button";
import "./Welcome.scss";

const Welcome = ({ onClick }) => {
  return (
    <div className="welcome">
      <div className="titleWrapper">
        <div className="iconWrapper">
          <SimonIcon />
        </div>
        <h1 className="simon">SIMON</h1>
      </div>
      <h2>Get ready to watch, remember, repeat!</h2>
      <div className="instructions">
        <p>
          The Simon game is the exciting electronic game of lights and sounds in
          which players must repeat random sequences of lights by pressing the
          colored pads in the correct order.
        </p>
      </div>
      <Button className="button" onClick={onClick} text="PLAY" />
    </div>
  );
};
export default Welcome;
