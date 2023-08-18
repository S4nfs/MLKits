/*
Technique - Regression 
Features -  longtitude/latitudes
labels - House price
Algorithm used - K-Nearest Neighbour (knn) "Birds of a feather flock together"

knn with one Intependent variable:
-Find distance between features (longtitude/latitudes of existing houses) and prediction points (longtitude/latitudes of new house)
Distance =  √(lat - lot)2 + (long - long)2
-Sort from lowest to greatest
-Look at the 'k' top records
-Average the label value of those top K records
*/

require("@tensorflow/tfjs-node")
const tf = require("@tensorflow/tfjs")
const loadCSV = require('./load-csv')

let { features, labels, testFeatures, testLabels } = loadCSV('kc_house_data.csv', {
    shuffle: true,
    splitTest: 10,
    dataColumns: ['lat', 'long'],
    labelColumns: ['price']
})
console.log(testFeatures)
console.log(testLabels)