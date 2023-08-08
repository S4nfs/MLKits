/*
Technique - Classification 
Algorithm used - K-Nearest Neighbour (knn) "Birds of a feather flock together"

*/

const output = [];
let predictionPoint = 300;
let k = 3;

// Ran every time a balls drops into a bucket
function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  output.push([dropPosition, bounciness, size, bucketLabel])
}

function runAnalysis() {

  const bucket = _.chain(numbers)
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

  console.log("The Ball will probably fall into", bucket)
}

const numbers = [[10, .5, 16, 1], [200, .5, 16, 4], [350, .5, 16, 4], [600, .5, 16, 5]]



function distance(point) {
  return Math.abs(point - predictionPoint)
}
