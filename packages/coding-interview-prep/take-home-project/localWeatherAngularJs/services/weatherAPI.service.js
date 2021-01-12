myApp.factory("WeatherAPI", [
  "$http",
  "PopupService",
  ($http, PopupService) => {
    const { showPopup } = PopupService;
    const API = {
      KEY: "3e88aa227f2dc3d76ab338f3f5e2a52c",
      ENDPOINT: "http://api.openweathermap.org/data/2.5/weather",
    };
    const WARNING = {
      TITLE: "Cannot get weather data",
      CONTENT: "Can't get the weather data about your location due :",
    };

    const showFailToGetWeatherDataPopup = (err) =>
      showPopup({
        warningTitle: WARNING.TITLE,
        warningContent: `${WARNING.CONTENT} ${
          err.message || "unknown reason."
        }`,
        isError: true,
        badgeContent: "Error",
      });
    const getCurrentPositionWeatherData = ({ lat = 0, long = 0 }) => {
      const endPointURL = `${API.ENDPOINT}?lat=${lat}&lon=${long}&appid=${API.KEY}`;
      const defaultRequestOptions = {
        method: "GET",
        url: endPointURL,
      };

      return $http(defaultRequestOptions).then(
        (response) => response.data,
        showFailToGetWeatherDataPopup
      );
    };

    return {
      getCurrentPositionWeatherData,
    };
  },
]);
