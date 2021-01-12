import React, { Component } from "react";
import IncreButton from "./Button/IncreButton";
import DecreButton from "./Button/DecreButton";


export default class TimeControl extends Component {
  render() {
    const { state : {
        sessionLength,
        breakLength
    }, handleClick : {
        break: {
            increment: handleBreakIncreClick,
            decrement: handleBreakDecreClick
        },
        session: {
            increment: handleSessionIncreClick,
            decrement: handleSessionDecreClick
        }
    } } = this.props;
    return (
      <div className="time-adjust">
        {/* item */}
        <div className="time-adjust__item">
          {/* header */}
          <header className="time-adjust__header">
            <h3 className="time-adjust__title" id="break-label">
              Break Length
            </h3>
          </header>
          {/* input */}
          <div className="number-input">
            {/* Increment btn */}
            <IncreButton countdownType="break" handleClick={handleBreakIncreClick}/>
            {/* value */}
            <span className="number-input__number" id="break-length">
              {breakLength}
            </span>
            {/* Decrement btn */}
            <DecreButton countdownType="break" handleClick={handleBreakDecreClick}/>
          </div>
        </div>
        {/* item */}
        <div className="time-adjust__item">
          {/* header */}
          <header className="time-adjust__header">
            <h3 className="time-adjust__title" id="session-label">
              Session Length
            </h3>
          </header>
          {/* input */}
          <div className="number-input">
            {/* Increment btn */}
            <IncreButton countdownType="session" handleClick={handleSessionIncreClick}/>
            {/* value */}
            <span id="session-length" className="number-input__number">
              {sessionLength}
            </span>
            {/* Decrement btn */}
            <DecreButton countdownType="session" handleClick={handleSessionDecreClick}/>
          </div>
        </div>
      </div>
    );
  }
}
