const myApp = angular.module("myApp", []);

myApp.controller("mainController", [
  "$scope",
  "WeatherAPI",
  "GeolocationAPI",
  ($scope, WeatherAPI, GeolocationAPI) => {
    const getPositionPromise = GeolocationAPI.getCurrentPosition();

    getPositionPromise
      .then(position => {
        $scope.lat = position.lat;
        $scope.long = position.long;

        const getWeatherPromise = WeatherAPI.getCurrentPositionWeatherData(
          position
        );

        return getWeatherPromise;
      })
      .then(weatherData => {
        console.log(weatherData);
      });
  }
]);
