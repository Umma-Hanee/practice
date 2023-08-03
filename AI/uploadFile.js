/* uploadFile.js */
require('dotenv').config()
const fs = require('fs')
const { Configuration, OpenAIApi } = require('openai');
const openaiApiKey = process.env.OPENAI_KEY;
const configuration = new Configuration({
  apiKey: openaiApiKey
});

const openai = new OpenAIApi(configuration);

async function upload() {
    try {
        const response = await openai.createFile(
            fs.createReadStream('./data.jsonl'),
            "fine-tune"
        );
        console.log('File ID: ', response.data.id)
    } catch (err) {
        console.log('err: ', err)
    }
}

upload()