function selectionSort(array) {
  let selectIndex = 0;

  while (selectIndex < array.length) {
    let min = array[selectIndex];
    let minIndex = selectIndex;

    for (let i = selectIndex; i < array.length; i++) {
      if (array[i] < min) {
        min = array[i];
        minIndex = i;
      }
    }

    [array[selectIndex], array[minIndex]] = [
      array[minIndex],
      array[selectIndex],
    ];

    selectIndex++;
  }

  return array;
}

const selection = selectionSort([
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
console.log("selection", selection);
