import React, { Component } from "react";

export default class MachinePad extends Component {
  render() {
    return (
      <div
        className="Machine-pad drum-pad"
        id={`pad-${this.props.name}`}
        onClick={this.props.handleClick}
      >
        {this.props.char}
        <audio
          src={this.props.src}
          preload="true"
          className="clip"
          id={this.props.char}
        />
      </div>
    );
  }
}
