// Importa la libreria OpenAI
import OpenAI from "openai";

// Inizializza l'API di OpenAI con la configurazione

const openai = new OpenAI({ apiKey :process.env.OPENAI_API_KEY });

const handler = async (event) => {
  try {

   

    //const subject = event.queryStringParameters.name || 'World'
   // Assicurati che il body della richiesta sia parsato correttamente
   const body = JSON.parse(event.body);
   // Adatta questa linea in base alla struttura dei tuoi dati
   const messages = body.messages; 

   const response = await openai.chat.completions.create({
     model: 'gpt-4',
     messages: messages,
     presence_penalty: 0,
     frequency_penalty: 0.3
   });
    
  console.log(response.data)
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
