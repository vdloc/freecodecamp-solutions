myApp.component("card", {
  templateUrl: "./components/card/card.template.html",
  bindings: {
    cardTitle: "@",
    cardItems: "<",
  },
});
