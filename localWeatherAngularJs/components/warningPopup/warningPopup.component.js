myApp.component("warningPopup", {
  templateUrl: "./components/warningPopup/warningPopup.template.html",
  bindings: {
    warningTitle: "@",
    warningContent: "@",
    badgeClass: "@",
    badgeContent: "@",
  },
});
