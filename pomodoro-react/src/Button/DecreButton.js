import React, { Component } from "react";

export default class DecreButton extends Component {
  render() {
    return (
      <span
        className="number-input__decre"
        id={`${this.props.countdownType}-decrement`}
        onClick={this.props.handleClick}
      >
        <i className="fas fa-arrow-down" />
      </span>
    );
  }
}
