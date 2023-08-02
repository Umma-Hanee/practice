/* createCompletion.js */
require('dotenv').config();
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');

const openaiApiKey = process.env.OPENAI_KEY;
const configuration = new Configuration({
  apiKey: openaiApiKey,
  organization: process.env.OPENAI_ORGANIZATION
});

const openai = new OpenAIApi(configuration);

// Arrow function for createCompletion
const createCompletion = async (prompt) => {
  try {
    const response = await openai.createCompletion({
      model: 'davinci:ft-personal-2023-07-30-08-33-18',
      prompt,
      max_tokens: 8
    });
    if (response.data) {
      console.log('choices: ', response.data.choices);
      return response.data.choices.text;
    }
  } catch (err) {
    console.log('err: ', err);
  }
};

module.exports = { createCompletion }; // Export the createCompletion arrow function
