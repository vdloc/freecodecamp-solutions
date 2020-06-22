myApp.factory("UnitConverterService", [
  "$http",
  function ($http) {
    const contryCodesJSONPath = "./jsons/country_code.json";
    let countryCodes;

    $http.get(contryCodesJSONPath).then((response) => {
      countryCodes = response.data;
      console.log("countryCodes", countryCodes);
    });

    const getTimeZoneHour = (timeZoneMilis) =>
      `${timeZoneMilis > 0 ? "+" : "-"}${timeZoneMilis / (60 * 60)}:00`;
    const kelvinToCelsius = (kelvinDeg) => kelvinDeg - 273.15;
    const kelvinToFarenheit = (kelvinDeg) => (kelvinDeg * 9) / 5 - 459.67;
    const getLocaleTimeString = (timeStamp) =>
      new Date(timeStamp).toLocaleTimeString();
    const meterToKilometers = (meters) => meters / 1000;

    const getCountryName = (code) => {
      if (countryCodes) {
        const country = countryCodes.find((country) => country.code === code);

        return country ? country.name : "";
      }

      return "";
    };

    return {
      getTimeZoneHour,
      kelvinToCelsius,
      kelvinToFarenheit,
      getLocaleTimeString,
      meterToKilometers,
      getCountryName,
    };
  },
]);
