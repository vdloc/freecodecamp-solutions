function PriorityQueue() {
  var collection = [];
  this.print = function () {
    console.log(collection);
  };
  // Only change code below this line
  this.enqueue = function (item) {
    collection.push(item);
  };

  this.dequeue = function (item) {
    const minPriority = Math.min(...collection.map((item) => item[1]));
    let dequeueItem;
    const dequeueItemIndex = collection.findIndex((item) => {
      if (item[1] === minPriority) {
        dequeueItem = item[0];
        return true;
      }
    });

    collection.splice(dequeueItemIndex, 1);

    return dequeueItem;
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

const queue = new PriorityQueue();

queue.enqueue(["foo", 2]);
queue.enqueue(["bar", 2]);
queue.enqueue(["fooblar", 1]);

queue.print();

queue.dequeue();
queue.print();
