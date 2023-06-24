import 'dotenv/config';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: process.env.ORG,
    apiKey: process.env.APIKEY,
});
const rl = readline.createInterface({ input, output });

// Create base prompt for all requests
const userPrompt = await rl.question('What kind of vibe are you going for? ');
let basePrompt = `Please compile a list of 10 real songs that best fit the following genre: ${userPrompt}`;
rl.close();

// START: get list of songs based on prompt
const openai = new OpenAIApi(configuration);
const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: basePrompt,
  max_tokens: 200,
  temperature: 0,
});
const breakpoint = /(\d+\.\s+)/
const songList = response.data.choices[0].text.split(breakpoint);
let songListFinal = []
songList.forEach(songName => {
  if (songName[0]=='\"') {
    let tempString = songName.replace(/(\n)/g, "");
    songListFinal.push(tempString);
  }
})
// END: get list of songs based on input

// TODO: GET Auth token from Spotify
