/*
Technique - Classification 
Algorithm used - K-Nearest Neighbour (knn) "Birds of a feather flock together"

*/

const output = []
function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket

  output.push([dropPosition, bounciness, size, bucketLabel])
  console.log(output)
}

function runAnalysis() {
  // Write code here to analyze stuff
}

const numbers = [[10, .5, 16, 1], [200, .5, 16, 4], [350, .5, 16, 4], [600, .5, 16, 5]]

let predictionPoint = 300;
let k = 3;

function distance(point) {
  return Math.abs(point - predictionPoint)
}
_.chain(numbers)
  .map(row => [distance(row[0]), row[3]])
  .sortBy(row => row[0])
  .slice(0, k)
  .countBy(row => row[1])
  .toPairs()
  .sortBy(row => row[2])
  .last()
  .first()
  .parseInt()
  .value()