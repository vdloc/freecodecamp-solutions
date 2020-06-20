function sym(args) {
  // Get all valid sets from arguments
  const argsList = [...arguments].filter((arg) => arg.length);

  if (argsList.length < 2) return argsList; // return when there is zero or one set

  const getDiff = (setA, setB) => {
    const mergedSet = [...new Set(setA), ...new Set(setB)];
    // Get unique items on each set and combine into one set

    return mergedSet.filter( //filter items which appear only once
      (item, _, arr) => arr.indexOf(item) === arr.lastIndexOf(item)
    );
  };

  return argsList
    .reduce((symDiff, set) => [...new Set(getDiff(set, symDiff))], [])
    .sort();
}

console.log(sym([1, 1, 2, 5], [2, 2, 3, 5], [3, 4, 5, 5]));
