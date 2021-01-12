function pairwise(arr, arg) {
  let indicesSum = 0;
  const indices = [];

  arr.forEach((item, index) => {
    const otherOfPair = arg - item;
    const otherItemIndex = arr.findIndex(
      (item, idx) => item === otherOfPair && !indices.includes(idx)
    );

    if (
      otherItemIndex > -1 &&
      !indices.includes(index) &&
      !indices.includes(otherItemIndex)
    ) {
      if (otherItemIndex === index) return;

      indices.push(index, otherItemIndex);
      indicesSum += index + otherItemIndex;
    }
  });

  return indicesSum;
}

const pairWise = pairwise([0, 0, 0, 0, 1, 1], 1);
