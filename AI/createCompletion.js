/* createCompletion.js */
require('dotenv').config()
const fs = require('fs')
const OpenAI = require("openai");
require('dotenv').config()
const fs = require('fs')
const { Configuration, OpenAIApi } = require('openai');
const openaiApiKey = process.env.OPENAI_KEY;
const configuration = new Configuration({
  apiKey: openaiApiKey
});

const openai = new OpenAIApi(configuration);

async function createCompletion() {
  try {
    const response = await openai.createCompletion({
      model: 'davinci:ft-personal-2023-07-30-08-33-18',
      prompt: 'Fintech',
      max_tokens: 8
    })
    if (response.data) {
      console.log('choices: ', response.data.choices)
    }
  } catch (err) {
    console.log('err: ', err)
  }
};

createCompletion()

