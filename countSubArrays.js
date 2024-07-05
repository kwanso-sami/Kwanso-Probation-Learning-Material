let c = 0;
const countSubArrays = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      c += 1;
      countSubArrays(arr[i]);
    } else {
      return;
    }
  }
};

countSubArrays([
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
  [[1], [[2], [3]], [4]],
]);
console.log(c);
