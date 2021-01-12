function Queue() {
  var collection = [];
  this.print = function () {
    console.log(collection);
  };
  // Only change code below this line
  this.enqueue = function (item) {
    collection.push(item);
  };

  this.dequeue = function (item) {
    const frontItem = collection[0];

    collection.pop();

    return frontItem;
  };

  this.front = function () {
    return collection[0];
  };

  this.size = function () {
    return collection.length;
  };

  this.isEmpty = function () {
    return !collection.length;
  };
  // Only change code above this line
}
