const capitalizeMe=(names)=>{
    return result = names.map((element)=>{
        return element.charAt(0).toUpperCase() + element.slice(1);
    })
}

console.log(capitalizeMe(["mavis", "senaida", "letty"]))
