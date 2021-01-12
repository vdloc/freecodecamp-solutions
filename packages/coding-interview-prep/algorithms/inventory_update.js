function updateInventory(arr1, arr2) {
  const obj1 = Object.fromEntries(arr1.map((item) => item.reverse()));
  // Create an object with arr1 inventory's information

  arr2.forEach((item) => { // Update the arr2 inventory information into object
    const [itemCount, itemName] = item;

    if (obj1[itemName]) {
      obj1[itemName] += itemCount;
    } else {
      obj1[itemName] = itemCount;
    }
  });

  return Object.entries(obj1) // return back sorted inventory from updated object
    .map((item) => item.reverse())
    .sort((a, b) => a[1].localeCompare(b[1]));
}

// Example inventory lists
var curInv = [
  [21, "Bowling Ball"],
  [2, "Dirty Sock"],
  [1, "Hair Pin"],
  [5, "Microphone"],
];

var newInv = [
  [2, "Hair Pin"],
  [3, "Half-Eaten Apple"],
  [67, "Bowling Ball"],
  [7, "Toothpaste"],
];

const updated = updateInventory(curInv, newInv);
console.log("updated", updated);
