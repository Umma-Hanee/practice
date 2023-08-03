/* listFineTunes.js */
require('dotenv').config()
const fs = require('fs')
const { Configuration, OpenAIApi } = require('openai');
const openaiApiKey = process.env.OPENAI_KEY;
const configuration = new Configuration({
  apiKey: openaiApiKey
});

const openai = new OpenAIApi(configuration);

async function listFineTunes() {
  try {
    const response = await openai.listFineTunes()
    console.log('data: ', response.data.data)
  } catch (err) {
    console.log('error:', err)
  }
}

listFineTunes()