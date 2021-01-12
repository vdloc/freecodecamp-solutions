function Stack() {
  var collection = [];
  this.print = function () {
    console.log(collection);
  };
  // Only change code below this line
  this.push = function (args) {
    collection.push(...arguments);
  };

  this.pop = function () {
    const topItem = collection[collection.length - 1];
    collection.pop();

    return topItem;
  };

  this.peek = function () {
    return collection[0];
  };

  this.isEmpty = function () {
    return !collection.length;
  };

  this.clear = function () {
    collection.length = 0;
  };
  // Only change code above this line
}
