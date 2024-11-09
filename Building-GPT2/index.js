/* 
    ____        _ __    ___                __________  _________ 
   / __ )__  __(_) /___/ (_)___  ____ _   / ____/ __ \/_  __/__ \
  / __  / / / / / / __  / / __ \/ __ `/  / / __/ /_/ / / /  __/ /
 / /_/ / /_/ / / / /_/ / / / / / /_/ /  / /_/ / ____/ / /  / __/ 
/_____/\__,_/_/_/\__,_/_/_/ /_/\__, /   \____/_/     /_/  /____/ 
                              /____/                             

The project is based on building Generatively Pretrained Transformer (GPT) - a deep neural network model based on the Transformer architecture, with respect to "Attention is All You Need" and OpenAI's GPT-2 / GPT-3 model approach by Andrej Karpathy (co-founder of OpenAI). 

The model will be trained on one of the Shakespeare's famous play and my favourite "As You Like It" for the dataset.

References: 
https://jalammar.github.io/illustrated-gpt2/
https://arxiv.org/abs/1706.03762
*/

import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as tf from '@tensorflow/tfjs'

//🍜Start with a dataset to train on. Let's download the shakespeare play for the dataset-------------------------
async function fetchWebsiteText(url) {
  try {
    // Fetch the HTML of the website
    const { data } = await axios.get(url)

    // Load the HTML into Cheerio
    const $ = cheerio.load(data)

    // Get all text content from the body and saving in txt
    const textContent = $('body').text()
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const filePath = path.join(__dirname, 'As-You-Like-It.txt')
    await fs.writeFile(filePath, textContent, (err) => {
      if (err) {
        console.error(`Error writing to file: ${err}`)
      } else {
        console.log('File written successfully')
      }
    })
  } catch (error) {
    console.error(`Error fetching the webpage: ${error}`)
  }
}

// Download the whole play "As You Like It - By William Shakespeare" in a file (Already done)
// fetchWebsiteText('https://shakespeare.mit.edu/asyoulikeit/full.html')

//🦴 All the unique characters that occur in this text-----------------------------------------------------------
async function GPT() {
  try {
    const text = await fs.promises.readFile('As-You-Like-It.txt', 'utf8')
    // Convert the text into a set of unique characters and then sort them
    const chars = Array.from(new Set(text)).sort()

    // Calculate vocabulary size
    const vocabSize = chars.length

    // Output the sorted characters and vocabulary size
    console.log(chars.join('')) // Output: !&',-.:;?ABCDEFGHIJKLMNOPQRSTUVWXY[]abcdefghijklmnopqrstuvwxyz|
    console.log(vocabSize) // Output:66

    // Create mappings from characters to integers (stoi) and integers to characters (itos)
    const stoi = {}
    const itos = {}
    chars.forEach((ch, i) => {
      stoi[ch] = i
      itos[i] = ch
    })

    // Encoder function: takes a string, outputs a list of integers
    const encode = (s) => s.split('').map((c) => stoi[c])

    // Decoder function: takes a list of integers, outputs a string
    const decode = (l) => l.map((i) => itos[i]).join('')

    // Example usage
    const encoded = encode('hii there')
    console.log(encoded) // Output: [46, 47, 47,  2, 58, 46, 43, 56, 43]

    const decoded = decode(encoded)
    console.log(decoded) // Output: "hii there"

    const encodedText = encode(text)
    const data = tf.tensor(encodedText, [encodedText.length], 'int32') // 'int32' is similar to torch.long in PyTorch

    // Print the shape and dtype
    console.log('Shape:', data.shape)
    console.log('Dtype:', data.dtype)

    // Display the first 1000 encoded characters
    const firstThousand = data.slice([0], [1000])
    firstThousand.print()

    // Split the data into training and validation sets 90% will be used for training, the rest 10% for validation
    const n = Math.floor(0.9 * data.length)
    const trainData = data.slice(0, n)
    const valData = data.slice(n)

    // Define the block size or context length
    const blockSize = 8
    const trainDataSubset = trainData.slice(0, blockSize + 1) // 9 character from training set

    const x = trainData.slice(0, blockSize) // The first 'blockSize' elements of the training data
    const y = trainData.slice(1, blockSize + 1) // The next 'blockSize' elements, starting from index 1

    for (let t = 0; t < blockSize; t++) {
      const context = x.slice(0, t + 1) // The input context, from the start to the current index
      const target = y[t] // The target is the current element in 'y'
      console.log(`when input is ${context} the target: ${target}`)
    }
  } catch (err) {
    console.error(`GPT Error: ${err}`)
  }
}

GPT()
