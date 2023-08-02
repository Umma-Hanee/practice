/* listFineTunes.js */
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

async function listFineTunes() {
  try {
    const response = await openai.listFineTunes()
    console.log('data: ', response.data.data)
  } catch (err) {
    console.log('error:', err)
  }
}

listFineTunes()