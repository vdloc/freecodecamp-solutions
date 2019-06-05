// @ts-nocheck
import React, { Component } from "react";
import TimeControl from "./TimeControl";
import Clock from "./Clock";
import ClockController from "./ClockController";

export default class App extends Component {
  static defaultProps = {
    minTimeLength: 1,
    maxTimeLength: 60,
    audioSrc: "https://goo.gl/65cBl1",
    defaultBreakLength: 5,
    defaultSessionLength: 25
  };
  state = {
    breakLength: 5,
    sessionLength: 25,
    isCountDownRunning: false,
    currentTimerLabel: "session",
    isAudioPlaying: false
  };

  componentWillMount() {
    this.setState({
      currentTime: {
        minute: this.numberPadder(this.state.sessionLength),
        second: this.numberPadder(0)
      }
    });
  }

  incrementBreakLength = oldState => {
    if (oldState.breakLength < this.props.maxTimeLength)
      return { breakLength: oldState.breakLength + 1 };
  };

  decrementBreakLength = oldState => {
    if (oldState.breakLength > this.props.minTimeLength)
      return { breakLength: oldState.breakLength - 1 };
  };

  incrementSessionLength = oldState => {
    if (oldState.sessionLength < this.props.maxTimeLength)
      return {
        sessionLength: oldState.sessionLength + 1,
        currentTime: {
          minute: this.numberPadder(oldState.sessionLength + 1),
          second: "00"
        }
      };
  };

  decrementSessionLength = oldState => {
    if (oldState.sessionLength > this.props.minTimeLength)
      return {
        sessionLength: oldState.sessionLength - 1,
        currentTime: {
          minute: this.numberPadder(oldState.sessionLength - 1),
          second: "00"
        }
      };
  };

  handleBreakIncreClick = () =>
    !this.state.isCountDownRunning && this.setState(this.incrementBreakLength);
  handleBreakDecreClick = () =>
    !this.state.isCountDownRunning && this.setState(this.decrementBreakLength);
  handleSessionIncreClick = () =>
    !this.state.isCountDownRunning &&
    this.setState(this.incrementSessionLength);
  handleSessionDecreClick = () =>
    !this.state.isCountDownRunning &&
    this.setState(this.decrementSessionLength);

  handlePlayPauseClick = () => {
    if (!this.state.isCountDownRunning) {
      this.playCountDown();
    } else {
      this.pauseCountDown();
    }
  };

  handleResetClick = () => {
    this.resetAudio();
    this.pauseCountDown();
    this.setState({
      sessionLength: this.props.defaultSessionLength,
      breakLength: this.props.defaultBreakLength,
      currentTime: {
        minute: this.numberPadder(this.props.defaultSessionLength),
        second: this.numberPadder(0)
      },
      currentTimerLabel: "session"
    });
  };

  pauseCountDown() {
    clearTimeout(this.state.countdown);
    this.setState({ isCountDownRunning: false });
  }

  playCountDown() {
    this.setState({ isCountDownRunning: true, countdown: this.countdown() });
  }

  numberPadder(number) {
    let str = number + "";
    return str.length < 2 ? str.padStart(2, "0") : str;
  }

  removeNumberPadder(str) {
    return str[0] === "0" ? str[1] / 1 : str[1] === "0" ? 0 : str / 1;
  }

  playAudio = () => {
    this.audio.play();
    this.setState(st => ({ isAudioPlaying: !st.isAudioPlaying }));
  };

  resetAudio = () => {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.setState({ isAudioPlaying: false });
  };

  countdown = () => {
    let {
      currentTime: { minute, second }
    } = this.state;

    minute = this.removeNumberPadder(minute);
    second = this.removeNumberPadder(second);

    return setInterval(() => {
      if (minute === 0 && second === 0) {
        if (this.state.currentTimerLabel === "session") {
          minute = this.state.breakLength;
          this.setState({ currentTimerLabel: "break" });
        } else {
          minute = this.state.sessionLength;
          this.setState({ currentTimerLabel: "session" });
        }
        this.playAudio();
      } else {
        if (second === 0) {
          second = 59;
          minute--;
        } else {
          second--;
        }
      }

      this.setState({
        currentTime: {
          minute: this.numberPadder(minute),
          second: this.numberPadder(second)
        }
      });
    }, 1000);
  };

  render() {
    const buttonClickHandlers = {
      break: {
        increment: this.handleBreakIncreClick,
        decrement: this.handleBreakDecreClick
      },
      session: {
        increment: this.handleSessionIncreClick,
        decrement: this.handleSessionDecreClick
      },
      controller: {
        playPause: this.handlePlayPauseClick,
        reset: this.handleResetClick
      }
    };

    return (
      <div className="page-wrapper">
        {/* inner container */}
        <div className="page-content">
          {/* header */}
          <header className="page-header">
            <h1 className="page-header__title">Pomodoro Clock</h1>
          </header>
          {/* main */}
          <main className="main-content">
            {/* time controler */}
            <TimeControl
              state={{ ...this.state }}
              handleClick={buttonClickHandlers}
            />
            {/* clock */}
            <Clock state={{ ...this.state }} />
            {/* controller */}
            <ClockController clickHandlers={buttonClickHandlers} />
            <audio preload="auto" ref={audio => (this.audio = audio)} src={this.props.audioSrc} id="beep" />
          </main>
          {/* footer */}
          <footer className="page-footer">
            <div className="author">by LocV</div>
          </footer>
        </div>
      </div>
    );
  }
}
