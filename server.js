// A express server which will handle api request coming in and respond back with a JSON Object, it will use body parser
import { Configuration, OpenAIApi } from "openai"


import  { config } from 'dotenv'
config()
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
const app = express()
const port = 8000

const configuration = new Configuration({
    organization: "org-FXtNEfkfo7OZtqpQ0pmOdBDQ",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration)

app.use(express.json())
app.use(cors())

app.post('/', async (req, res) => {
    const { message } = req.body
    const response = await openai.createCompletion({
        model: "davinci:ft-mettro-2023-06-01-00-54-06",
        prompt: `Welcome to Carpet One Stafford, Australia. I want carpet products. ${message}`,
        temperature: 0.9,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: ["Human", "AI"],
      });
      console.log(response.data.choices)
      if(response.data){
        if(response.data.choices){
            res.json({
                message: response.data.choices[0].text
            })
        }
      }
    
})


app.post('/completions', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "This is related content for Carpet One Stafford, Australia website, " + req.body.message }],
            max_tokens: 100,
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options) 
        const data = await response.json()
        res.send(data)
    } catch (error){
        console.error(error)
    }
})

app.listen(port, () => {
    console.log('Server API is running in port: ' + port)
})