function optionsBoardController() {
  const $ctrl = this;
  $ctrl.temperatureUnit = "Kelvin";
}

myApp.component("optionsBoard", {
  templateUrl: "./components/optionsBoard/optionsBoard.template.html",
  controller: optionsBoardController,
  bindings: {
    updateTemperatureUnit: "<",
  },
});
