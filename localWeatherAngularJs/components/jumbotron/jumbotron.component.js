const jumbotronController = function (UnitConverterService) {
  const $ctrl = this;
  const {
    getTimeZoneHour,
    kelvinToCelsius,
    kelvinToFarenheit,
    displayKelvinUnit,
    getLocaleTimeString,
    meterToKilometers,
    getCountryName,
  } = UnitConverterService;
  const TEMPERATURE_UNIT = {
    KELVIN: "Kelvin",
    CELSIUS: "Celsius",
    FAHRENHEIT: "Fahrenheit",
  };

  let temperatureInformations;

  const createLocationInformation = (weatherData) => ({
    Latitude: weatherData.coord.lat,
    Longitude: weatherData.coord.lon,
    Country: getCountryName(weatherData.sys.country),
    City: weatherData.name,
    Sunrise: getLocaleTimeString(weatherData.sys.sunrise),
    Sunset: getLocaleTimeString(weatherData.sys.sunset),
    Timezone: getTimeZoneHour(weatherData.timezone),
  });

  const setTemperatureInformations = (weatherData) => {
    temperatureInformations = {
      Temperature: weatherData.main.temp,
      "Feel likes": weatherData.main.feels_like,
      "Min temperature": weatherData.main.temp_min,
      "Max temperature": weatherData.main.temp_max,
      Pressure: `${weatherData.main.pressure} Pascal`,
      Humidity: weatherData.main.humidity,
      Visibility: `${meterToKilometers(weatherData.visibility)} km`,
    };
  };

  const createTemperatureInformationByUnit = (unit) => {
    const converter =
      unit === TEMPERATURE_UNIT.CELSIUS
        ? kelvinToCelsius
        : unit === TEMPERATURE_UNIT.FAHRENHEIT
        ? kelvinToFarenheit
        : displayKelvinUnit;

    const updatedTemperatureInformations = Object.assign(
      {},
      temperatureInformations
    );

    ["Temperature", "Feel likes", "Min temperature", "Max temperature"].forEach(
      (field) => {
        updatedTemperatureInformations[field] = converter(
          updatedTemperatureInformations[field]
        );
      }
    );

    return updatedTemperatureInformations;
  };

  const createWeatherInformations = (weatherData) => ({
    "Main weather": weatherData.weather[0].main,
    Description: weatherData.weather[0].description,
    "Wind speed": `${weatherData.wind.speed} km/h`,
    "Wind degree": `${weatherData.wind.deg} deg`,
  });

  const createInformationsItems = (informations) =>
    Object.entries(informations).map((item) => ({
      name: item[0],
      value: item[1],
    }));

  $ctrl.$onChanges = function (changes) {
    if (changes.weather.currentValue) {
      const weatherData = changes.weather.currentValue;
      const locationInformations = createLocationInformation(weatherData);
      const weatherInformations = createWeatherInformations(weatherData);

      setTemperatureInformations(weatherData);
      const formatedTemperatureInformations = Object.assign(
        {},
        temperatureInformations
      );

      [
        "Temperature",
        "Feel likes",
        "Min temperature",
        "Max temperature",
      ].forEach((field) => {
        formatedTemperatureInformations[field] = displayKelvinUnit(
          formatedTemperatureInformations[field]
        );
      });

      $ctrl.locationInformations = createInformationsItems(
        locationInformations
      );
      $ctrl.temperatureInformations = createInformationsItems(
        formatedTemperatureInformations
      );
      $ctrl.weatherInformations = createInformationsItems(weatherInformations);
    }
  };

  $ctrl.updateTemperatureUnit = (unit) => {
    if (!temperatureInformations) return;
    const updatedTemperatureInformations = createTemperatureInformationByUnit(
      unit
    );

    $ctrl.temperatureInformations = createInformationsItems(
      updatedTemperatureInformations
    );
  };
};

myApp.component("jumbotron", {
  templateUrl: "./components/jumbotron/jumbotron.template.html",
  controller: ["UnitConverterService", jumbotronController],
  bindings: {
    weather: "<",
  },
});
