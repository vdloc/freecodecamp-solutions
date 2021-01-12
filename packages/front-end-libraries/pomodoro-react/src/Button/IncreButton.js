import React, { Component } from "react";

class IncreButton extends Component {
  render() {
    return (
      <span
        className="number-input__incre"
        id={`${this.props.countdownType}-increment`}
        onClick={this.props.handleClick}
      >
        <i className="fas fa-arrow-up" />
      </span>
    );
  }
}

export default IncreButton;
