myApp.factory("GeolocationAPI", [
  "$window",
  "$q",
  "PopupService",
  ($window, $q, PopupService) => {
    let isGeolocationAvailable = false;
    const { showPopup } = PopupService;
    const defaultGeolocationOptions = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000,
    };
    const WARNING = {
      NO_GEO_LOCATION: {
        TITLE: "No Support",
        CONTENT: "Your current browser doesn't support Geolocation feature.",
      },
      FAIL_TO_LOAD_GEO_LOCATION: {
        TITLE: "Fail to get the location",
        CONTENT: "Something went wrong when getting your location: ",
      },
    };

    const showNoGeoLocationPopup = () =>
      showPopup({
        warningTitle: WARNING.NO_GEO_LOCATION.TITLE,
        warningContent: WARNING.NO_GEO_LOCATION.CONTENT,
        isError: true,
        badgeContent: "Error",
      });

    const showFailToGeoLocationPopup = (err) => {
      const errMessage = err.message;
      const popupOptions = {
        warningTitle: WARNING.FAIL_TO_LOAD_GEO_LOCATION.TITLE,
        warningContent: `${WARNING.FAIL_TO_LOAD_GEO_LOCATION.CONTENT}${err.message}.`,
        isError: true,
        badgeContent: "Error",
      };

      if (errMessage.includes("deni")) {
        popupOptions.warningContent =
          popupOptions.warningContent +
          "\n" +
          `Please reload the browser and grant the geolocation permission in dialog box.
        `;
      }

      showPopup(popupOptions);
    };

    const getCurrentPosition = () => {
      if (!isGeolocationAvailable) return showNoGeoLocationPopup();

      return $q((resolve, reject) => {
        $window.navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          defaultGeolocationOptions
        );
      }).then(
        (position) =>
          position
            ? {
                lat: position.coords.latitude,
                long: position.coords.longitude,
              }
            : null,
        showFailToGeoLocationPopup
      );
    };

    if ("geolocation" in $window.navigator) {
      isGeolocationAvailable = true;
    } else {
      showNoGeoLocationPopup();
    }

    return {
      getCurrentPosition,
    };
  },
]);
