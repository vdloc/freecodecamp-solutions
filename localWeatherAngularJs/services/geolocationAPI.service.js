myApp.factory("GeolocationAPI", [
  "$window",
  "$log",
  "$q",
  ($window, $log, $q) => {
    let isGeolocationAvailable = false;
    const defaultGeolocationOptions = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000
    };
    const getCurrentPosition = () => {
      if (!isGeolocationAvailable)
        return Promise.reject(
          "Your current browser doesn't support Geolocation feature"
        );

      return $q((resolve, reject) => {
        $window.navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          defaultGeolocationOptions
        );
      }).then(
        position => ({
          lat: position.coords.latitude,
          long: position.coords.longitude
        }),
        err => {
          $log.error(
            "Something went wrong when getting your location: ",
            err.message
          );
        }
      );
    };

    if ("geolocation" in $window.navigator) {
      isGeolocationAvailable = true;
    } else {
      $log.warn("This current browser doesn't support Geolocation feature.");
    }

    return {
      getCurrentPosition
    };
  }
]);
