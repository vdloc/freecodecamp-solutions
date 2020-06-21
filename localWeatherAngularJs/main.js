const myApp = angular.module("myApp", []);

myApp.controller("mainController", [
  "$scope",
  "WeatherAPI",
  "GeolocationAPI",
  "PopupService",
  ($scope, WeatherAPI, GeolocationAPI, PopupService) => {
    PopupService.init($scope);

    const getPositionPromise = GeolocationAPI.getCurrentPosition();

    getPositionPromise
      .then((position) => {
        if (!position) return; 

        return WeatherAPI.getCurrentPositionWeatherData(position);
      })
      .then((weatherData) => {
        console.log(weatherData);
      });
  },
]);
