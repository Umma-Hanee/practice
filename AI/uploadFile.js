/* uploadFile.js */
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