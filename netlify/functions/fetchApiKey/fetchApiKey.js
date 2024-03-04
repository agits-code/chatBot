// Importa la libreria OpenAI
import OpenAI from "openai";

// Inizializza l'API di OpenAI con la configurazione

const openai = new OpenAI({ apiKey :process.env.OPENAI_API_KEY });

const handler = async (event) => {
  try {

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: event.body,
      presence_penalty: 0,
      frequency_penalty: 0.3
    })

    const subject = event.queryStringParameters.name || 'World'
    
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}` }),
      
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
// https://chat-bot-test-openai.netlify.app/.netlify/functions/fetchApiKey
