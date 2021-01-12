// @ts-nocheck
import React, { Component } from "react";
import PlayPauseButton from "./Button/PlayPauseButton";
import ResetButton from "./Button/ResetButton";

export default class ClockController extends Component {
  render() {
    const {
      controller: { playPause, reset }
    } = this.props.clickHandlers;
    return (
      <div className="controls">
        {/* play pause */}
        <PlayPauseButton handleClick={playPause} />
        {/* reset */}
        <ResetButton handleClick={reset} />
      </div>
    );
  }
}
