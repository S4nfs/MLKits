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



Demo:
const features = tf.tensor([
    [-150, 20.0],
    [-151.5, 25.5],
    [-152.9, 28.9]
])

const labels = tf.tensor([
    [200],
    [220],
    [199]
])

const k = 2
const predictionPoint = tf.tensor([-150, 24])
features
    .sub(predictionPoint)
    .pow(2)
    .sum(1)
    .pow(0.5)
    .expandDims(1)
    .concat(labels, 1)
    .unstack()
.sort((a,b) => a.get(0) > b.get(0) ? 1 : -1)
.slice(0, k)
.reduce((acc, pair) => acc + pair.get(1), 0)/k

*/
require("@tensorflow/tfjs-node")
const tf = require("@tensorflow/tfjs")
const loadCSV = require('./load-csv')

function knn(features, labels, predictionPoint, k) {
    return features
        .sub(predictionPoint)
        .pow(2)
        .sum(1)
        .pow(0.5)
        .expandDims(1)
        .concat(labels, 1)
        .unstack()
        .sort((a, b) => a.get(0) > b.get(0) ? 1 : -1)
        .slice(0, k)
        .reduce((acc, pair) => acc + pair.get(1), 0) / k
}
let { features, labels, testFeatures, testLabels } = loadCSV('kc_house_data.csv', {
    shuffle: true,
    splitTest: 10,
    dataColumns: ['lat', 'long'],
    labelColumns: ['price']
}) //remember all are 2D arrays
features = tf.tensor(features)
labels = tf.tensor(labels)


const result = knn(features, labels, tf.tensor(testFeatures[0]), 10)
console.log("Result", result, testLabels[0][0])