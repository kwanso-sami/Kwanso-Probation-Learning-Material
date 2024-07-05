const removeDuplicates=(arr)=>{
  let newArr = [];
  for (elem of arr) {
    if (!newArr.includes(elem)) {
      newArr.push(elem);
    }
  }
  return newArr;
  
};

console.log(removeDuplicates([1, 0, 1, 0]));
