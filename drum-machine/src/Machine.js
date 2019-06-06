// @ts-nocheck
import React, { Component } from "react";
import MachinePane from "./MachinePane";
import MachinePads from "./MachinePads";
import data from "./data";
import { getFileName, getRandom } from "./helper";
import MachineDiplay from "./MachineDisplay";


const { audioSrc, padColors } = data;

export default class Machine extends Component {
  static defaultProps = {
    appTitle: "FCC LaunchPad",
    padsChar: ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"]
  };

  state = {
    currentPreset: "heater",
    isPowerOn: true,
    currentSample: ""
  };

  mappingPads(preset) {
    return this.props.padsChar.map((char, id) => {
      const currentAudioURL = audioSrc[preset][id];
      const padColor = getRandom(padColors);
      const padClipName = getFileName(currentAudioURL);
      const padAudioSrc = currentAudioURL;
      const padData = {
        key: char,
        color: padColor,
        name: padClipName,
        src: padAudioSrc
      };
      padData.handleClick = e => {
        const target = e.target;
        const audio =
          target.nodeName === "AUDIO" ? target : target.querySelector("audio");
        if (this.state.isPowerOn) {
          if (audio.currentTime !== 0) {
            audio.currentTime = 0;
          }
          audio.play();
        }
        this.setState({
          currentSample: padData.name
        });
      };
      return padData;
    });
  }

  handleKeyPres = () => {
    window.addEventListener("keyup", e => {
      const key = e.key.toUpperCase();
      if (this.props.padsChar.includes(key)) {
        const pad = document.querySelector(`#${key}`);
        pad.click();
      }
    });
  };

  componentDidMount() {
    this.handleKeyPres();
  }

  handlePowerSwitchChane = () => {
    this.setState(st => ({
      isPowerOn: !st.isPowerOn
    }));
  };

  handlePresetSwitchChange = () => {
    this.setState(st => ({
      currentPreset: st.currentPreset === 'heater' ? 'smoothPiano' : 'heater'
    }));
  };
  render() {
    return (
      <div className="App">
        {/* header */}
        <header className="App-header">
          <h1 className="App-title text-center">{this.props.appTitle}</h1>
        </header>
        <div id="drum-machine" className="Machine">
          <div className="container">
            <div className="row justify-content-around">
              <MachinePane
                color="green"
                title="Preset"
                checkedState={
                  this.state.currentPreset === "heater" ? false : true
                }
                handleChange={this.handlePresetSwitchChange}
              />
              <MachinePads
                padsMap={this.mappingPads(this.state.currentPreset)}
              />
              <MachinePane
                color="pink"
                title="Power"
                checkedState={this.state.isPowerOn}
                handleChange={this.handlePowerSwitchChane}
              />
            </div>
            <MachineDiplay sampleName={this.state.currentSample} />
          </div>
        </div>
      </div>
    );
  }
}
