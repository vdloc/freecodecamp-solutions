import React, { Component } from "react";

export default class ResetButton extends Component {
  render() {
    return (
      <div className="controls__reset" id="reset" onClick={this.props.handleClick}>
        <div className="controls__reset-inner" />
      </div>
    );
  }
}
