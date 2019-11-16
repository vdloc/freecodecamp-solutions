myApp.factory("WeatherAPI", [
  "$http",
  "$log",
  ($http, $log) => {
    const getCurrentPositionWeatherData = ({lat = 0, long = 0}) => {
      const endPointURL = `https://fcc-weather-api.glitch.me/api/current?lon=${long}&lat=${lat}`;
      const defaultRequestOptions = {
        method: "GET",
        url: endPointURL
      };

      return $http(defaultRequestOptions).then(
        response => response.data,
        err =>
          $log.error(
            `Can't get the weather data about your location due : ${
              err.messsage
            }`
          )
      );
    };

    return {
      getCurrentPositionWeatherData
    };
  }
]);
