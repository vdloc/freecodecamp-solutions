import React, { Component } from "react";

export default class Clock extends Component {
  render() {
    const {
      currentTimerLabel,
      currentTime: { minute, second }
    } = this.props.state;
    return (
      <div className="clock-block">
        {/* real */}
        <div className="clock real">
          <h3 className="clock-brand">
            <span>Philips</span>
          </h3>
          <div className="time-countdown">
            {/* header */}
            <header className="time-countdown__header">
              <h3 className="time-countdown__title" id="timer-label">
                {currentTimerLabel.toUpperCase()}
              </h3>
            </header>
            {/* display */}
            <div className="time-countdown__display" id="time-left">
              {minute}:{second}
            </div>
          </div>
        </div>
        {/* mirror */}
        <div className="clock mirror" />
      </div>
    );
  }
}
