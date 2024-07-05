const objectToArrays = (obj) => {
  let arr = [];
  Object.entries(obj).map((entry) => {
    let key = entry[0];
    let value = entry[1];

    arr.push([key, value]);
  });

  return arr;
};

console.log(
  objectToArrays({
    D: 1,
    B: 2,
    C: 3,
  })
);
