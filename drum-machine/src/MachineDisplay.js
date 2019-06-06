import React, { Component } from "react";

export default class MachineDiplay extends Component {
  render() {
    return (
      <div className="row justify-content-center">
        <h5 className="Machine-clipNameDisplay" id="display">
          {this.props.sampleName}
        </h5>
      </div>
    );
  }
}
