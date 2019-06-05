import React, { Component } from "react";

export default class PlayPauseButton extends Component {
  render() {
    return (
      <div className="controls__play-pause" id="start_stop" onClick={this.props.handleClick}>
        {/* play */}
        <div className="controls__play" />
        {/* pause */}
        <div className="controls__pause" />
      </div>
    );
  }
}
