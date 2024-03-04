// Importa la libreria OpenAI
import OpenAI from "openai";

// Inizializza l'API di OpenAI con la configurazione

const openai = new OpenAI({ apiKey :process.env.OPENAI_API_KEY });

const handler = async (event) => {
  try {

   console.log(event.body)
   // {"messages":[{"role":"system","content":"You are a helpful assistant."},{"content":"hello","role":"user"},{"content":"spiegami pi","role":"user"},{"content":"in inglese","role":"user"},{"content":"e anche in tedesco","role":"user"},{"content":"quale è capitale di cile?","role":"user"}]}
    //const subject = event.queryStringParameters.name || 'World'
   // Assicurati che il body della richiesta sia parsato correttamente
   const body = JSON.parse(event.body);
   // Adatta questa linea in base alla struttura dei tuoi dati
   const messages = body.messages; 
   console.log(messages)
   /*
   [
  { role: 'system', content: 'You are a helpful assistant.' },
  { content: 'hello', role: 'user' },
  { content: 'spiegami pi', role: 'user' },
  { content: 'in inglese', role: 'user' },
  { content: 'e anche in tedesco', role: 'user' },
  { content: 'quale è capitale di cile?', role: 'user' }
]
   */
   const response = await openai.chat.completions.create({
     model: 'gpt-4',
     messages: messages,
     presence_penalty: 0,
     frequency_penalty: 0.3
   });
    
  console.log(response)
  /*
  {
  id: 'chatcmpl-8ysUYkv2CnbUT7THJ791AMIx2FxQ9',
  object: 'chat.completion',
  created: 1709519838,
  model: 'gpt-4-0613',
  choices: [
    {
      index: 0,
      message: [Object],
      logprobs: null,
      finish_reason: 'stop'
    }
  ],
  usage: { prompt_tokens: 56, completion_tokens: 9, total_tokens: 65 },
  system_fingerprint: null
}
  */
  const messageContent = response.choices[0].message.content;
  console.log(messageContent); // La capitale del Cile è Santiago.

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.choices[0].message }),
      
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
// https://chat-bot-test-openai.netlify.app/.netlify/functions/fetchApiKey
