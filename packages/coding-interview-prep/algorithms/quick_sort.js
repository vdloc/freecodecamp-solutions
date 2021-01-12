function quickSort(array) {
  const pivot = array[Math.round(array.length / 2)];
  const prevs = [];
  const nexts = [];

  if (array.length === 1) {
    return array;
  }

  array.forEach((item) => (item > pivot ? nexts.push(item) : prevs.push(item)));

  return [...quickSort(nexts), ...quickSort(prevs)];
}

const quick = quickSort([
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
console.log("quick", quick);
