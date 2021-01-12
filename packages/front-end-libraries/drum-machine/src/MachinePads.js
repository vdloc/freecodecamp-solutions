// @ts-nocheck
import React, { Component } from "react";
import MachinePad from "./MachinePad";

export default class MachinePads extends Component {
  render() {
    const { padsMap } = this.props;
    return (
      <div className="Machine-pads">
        {padsMap.map(pad => (
          <MachinePad name={pad.name} char={pad.key} src={pad.src} handleClick={pad.handleClick}/>
        ))}
      </div>
    );
  }
}
