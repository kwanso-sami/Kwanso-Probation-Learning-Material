const unionIntersection = (arr1, arr2) => {
  let union = new Set(arr1);
  let intersection = new Set();

  for (elem of arr2) {
    if (arr1.includes(elem)) {
      intersection.add(elem);
    } else {
      union.add(elem);
    }
  }

  return [Array.from(intersection), Array.from(union)];
};

console.log(unionIntersection([1, 2, 3, 4, 4], [4, 5, 9]));
