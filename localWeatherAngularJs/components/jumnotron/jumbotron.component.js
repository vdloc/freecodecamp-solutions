const jumbotronController = function (UnitConverterService) {
  const $ctrl = this;
  const {
    getTimeZoneHour,
    kelvinToCelsius,
    kelvinToFarenheit,
    getLocaleTimeString,
    meterToKilometers,
    getCountryName,
  } = UnitConverterService;
  const locationInformations = {
    Latitude: "",
    Longitude: "",
    Country: "",
    City: "",
    Sunrise: "",
    Sunset: "",
    Timezone: "",
  };

  $ctrl.weatherInformations = {
    main: "",
    description: "",
    icon: "",
  };

  $ctrl.windAndSpeedInformations = {
    wind: {
      speed: "",
      deg: "",
    },
    clouds: {
      all: "",
    },
  };

  $ctrl.temperatureInformations = {
    temp: "",
    feels_like: "",
    temp_min: "",
    temp_max: "",
    pressure: "",
    humidity: "",
    visibility: "",
  };

  $ctrl.$onChanges = function (changes) {
    if (changes.weather.currentValue) {
      const weather = changes.weather.currentValue;

      locationInformations.Latitude = weather.coord.lat;
      locationInformations.Longitude = weather.coord.lon;
      locationInformations.Country = getCountryName(weather.sys.country);
      locationInformations.Sunrise = getLocaleTimeString(weather.sys.sunrise);
      locationInformations.Sunset = getLocaleTimeString(weather.sys.sunset);
      locationInformations.Timezone = getTimeZoneHour(weather.timezone);
      locationInformations.City = weather.name;

      $ctrl.locationInformations = Object.entries(
        locationInformations
      ).map((item) => ({ name: item[0], value: item[1] }));
    }
  };
};

myApp.component("jumbotron", {
  templateUrl: "./components/jumnotron/jumbotron.template.html",
  controller: ["UnitConverterService", jumbotronController],
  bindings: {
    weather: "<",
  },
});
