function insertionSort(array) {
  const sequence = [];//Sorted sequence items
  const findAndInsert = (item) => {
    if (!sequence.length) {
      return sequence.push(item);
    }

    for (let i = sequence.length - 1; i >= 0; i--) {
      if (sequence[i] >= item) {
        if (!sequence[i - 1]) {
          sequence.splice(i - 1, 0, item);
          break;
        } else if (sequence[i - 1] && sequence[i - 1] <= item) {
          sequence.splice(i, 0, item);
          break;
        }
      } else {
        sequence.push(item);
        break;
      }
    }
  };

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    findAndInsert(item);
  }

  return sequence;
}

const insertion = insertionSort([
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
console.log("insertion", insertion);
