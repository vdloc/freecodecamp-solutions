function bubbleSort(array) {
  let remain = array.length;
  let needSwap = false;

  while (remain && !needSwap) {
    needSwap = false;
    for (let i = 0; i < remain; i++) {
      if (i < remain - 1 && array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        needSwap = true; // Set a flag that array needed re-order
      }
    }
    // If array has been reordered, set flag to false,
    // else set flag to true so the array finaly got it's true order
    needSwap = !needSwap;
    remain--; // reduce loop length each loop
  }

  return array;
}

const bubble = bubbleSort([
  1,
  4,
  2,
  8,
  345,
  123,
  43,
  32,
  5643,
  63,
  123,
  43,
  2,
  55,
  1,
  234,
  92,
]);
console.log("bubble", bubble);
