/* createCompletion.js */
require('dotenv').config()
const fs = require('fs')
const OpenAI = require("openai");
const { Configuration, OpenAIApi } = OpenAI;
const openaiApiKey = process.env.OPENAI_KEY;
const configuration = new Configuration({
    organization: "org-YSkgH7aJIs1OK0UgW0s5bB67",
    apiKey: "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",
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

