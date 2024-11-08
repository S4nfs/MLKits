/* 
    ____        _ __    ___                __________  _________ 
   / __ )__  __(_) /___/ (_)___  ____ _   / ____/ __ \/_  __/__ \
  / __  / / / / / / __  / / __ \/ __ `/  / / __/ /_/ / / /  __/ /
 / /_/ / /_/ / / / /_/ / / / / / /_/ /  / /_/ / ____/ / /  / __/ 
/_____/\__,_/_/_/\__,_/_/_/ /_/\__, /   \____/_/     /_/  /____/ 
                              /____/                             

The project is based on building Generatively Pretrained Transformer (GPT), with respect to "Attention is All You Need" (https://arxiv.org/abs/1706.03762) and OpenAI's GPT-2 / GPT-3 model approach by Andrej Karpathy (co-founder of OpenAI). 

The model will be trained on one of the Shakespeare's famous play and my favourite "As You Like It" for the dataset.
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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
const fileContents = fs.readFile('As-You-Like-It.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const text = data

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
})
