/* createFineTune.js */
require('dotenv').config()
const fs = require('fs')
const { Configuration, OpenAIApi } = require('openai');
const openaiApiKey = process.env.OPENAI_KEY;
const configuration = new Configuration({
  apiKey: openaiApiKey
});

const openai = new OpenAIApi(configuration);

async function createFineTune() {
  try {
    const response = await openai.createFineTune({
      training_file: 'file-2jlYWcdUj5NuCzk4wOqaSWmT',
      model: 'davinci'
    })
    console.log('response: ', response)
  } catch (err) {
    console.log('error: ', err.response.data.error)
  }
}

createFineTune()