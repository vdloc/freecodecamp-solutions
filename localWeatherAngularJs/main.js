const myApp = angular.module("myApp", []);

myApp.controller("mainController", [
  "$scope",
  "WeatherAPI",
  "GeolocationAPI",
  ($scope, WeatherAPI, GeolocationAPI) => {
    const getPositionPromise = GeolocationAPI.getCurrentPosition();

    if (getPositionPromise) {
      getPositionPromise.then(position => {
        $scope.lat = position.lat;
        $scope.long = position.long;

        return WeatherAPI.getCurrentPositionWeatherData(position);
      }).then(weatherData => {
          console.log(weatherData)
      });
    }
  }
]);
