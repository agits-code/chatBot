// Importa la libreria OpenAI
import OpenAI from "openai";

// Inizializza l'API di OpenAI con la configurazione

const openai = new OpenAI({ apiKey :process.env.OPENAI_API_KEY });

const handler = async (event) => {
  try {

   

    //const subject = event.queryStringParameters.name || 'World'
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: event.body,
      presence_penalty: 0,
      frequency_penalty: 0.3
  })
    
  
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.data }),
      
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
// https://chat-bot-test-openai.netlify.app/.netlify/functions/fetchApiKey
