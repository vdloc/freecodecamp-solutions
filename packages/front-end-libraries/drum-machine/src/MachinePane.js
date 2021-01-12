import React, { Component } from "react";

export default class MachinePane extends Component {
  render() {
    const { title, color, checkedState, handleChange } = this.props;
    return (
      <div className={`Switch Switch--${color}`}>
        <header className="Switch-header">
          <h4 className="Switch-title">{title}</h4>
        </header>
        <div className="Switch-icon">
          <input
            type="checkbox"
            className={`Switch-toggle`}
            id={`switch-${title}`}
            checked={checkedState}
            onChange={handleChange}
          />
          <label htmlFor={`switch-${title}`} className="Switch-slider" />
        </div>
      </div>
    );
  }
}
