const combineArrays = (...arrs) => {
  const longestArr = arrs.reduce((maxLengthArr, arr) => {
    return arr.length > maxLengthArr.length ? arr : maxLengthArr;
  });
  const result = [];
  for (let i = 0; i < longestArr.length; i++) {
    const child = [];
    arrs.forEach(arr => {
      typeof arr[i] !== "undefined" && child.push(arr[i]);
    });
    result.push(child);
  }
  return result;
};

const getFileName = url => {
  const pattern = new RegExp(/[^\/]*(?=(.mp3$))/g);
  return url.match(pattern)[0];
};

const getRandom = list => list[(Math.random() * list.length) | 0];

const getHSLColor = (colorArr, opacity = 1) =>
  `hsla(${colorArr[0]}, ${colorArr[1]}%, ${colorArr[2]}%, ${opacity})`;

export { getFileName, getRandom, getHSLColor };
