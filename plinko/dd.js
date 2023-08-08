const numbers = [
    [14, 2], [5, 3]
    ,
    [1, -5], [88, 15]]

console.log(sort(numbers, function (row) {
    return row[1]
}))