myApp.factory("PopupService", [
  () => {
    let modalElem;
    let _scope;
    const BADGE_CLASS = {
      WARNING: "badge-warning",
      ERROR: "badge-danger",
      SUCCESS: "badge-success",
    };
    const MODAL_EVENT = {
      HIDDEN: "hidden.bs.modal",
    };

    const openPopup = (callback) => {
      if (!modalElem) {
        modalElem = $("#warningPopup");
      }

      if (callback) {
        modalElem.off(MODAL_EVENT.HIDDEN);
        modalElem.on(MODAL_EVENT.HIDDEN, callback);
      }

      modalElem.modal();
    };

    const showPopup = ({
      warningContent = "",
      warningTitle = "",
      isWarning = false,
      isError = false,
      isSuccess = false,
      badgeContent = "",
      callback,
    }) => {
      _scope.warningContent = warningContent;
      _scope.warningTitle = warningTitle;
      _scope.badgeContent = badgeContent;
      console.log("_scope.badgeContent", _scope.badgeContent);
      _scope.badgeClass = isWarning
        ? BADGE_CLASS.WARNING
        : isError
        ? BADGE_CLASS.ERROR
        : isSuccess
        ? BADGE_CLASS.SUCCESS
        : "";

      openPopup(callback);
    };

    return {
      init: ($scope) => (_scope = $scope),
      showPopup,
    };
  },
]);
