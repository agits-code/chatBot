import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, get, remove } from 'firebase/database'

//import { process } from './env'
/*
// Importa la libreria OpenAI
import OpenAI from "openai";

// Inizializza l'API di OpenAI con la configurazione

const openai = new OpenAI({ apiKey :process.env.OPENAI_API_KEY, dangerouslyAllowBrowser: true });
*/
const appSettings = {
    databaseURL: 'https://freddy-openai-default-rtdb.europe-west1.firebasedatabase.app/'
}

const app = initializeApp(appSettings)

const database = getDatabase(app)

const conversationInDb = ref(database)

const chatbotConversation = document.getElementById('chatbot-conversation')
//let conversationStr = ''

const instructionObj = {
    role: 'system',
    content: 'You are a helpful assistant.'
    //content: 'You are a sarcastic assistant.'
    //content: 'You are an assistant that gives very short answers.'
}


document.addEventListener('submit', (e) => {
    e.preventDefault()
    const userInput = document.getElementById('user-input')
    //conversationStr += ` ${userInput.value}`
    push(conversationInDb, {
        role: 'user',
        content: userInput.value
    })
    fetchReply()
    //console.log(conversationArr)
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newSpeechBubble)
    newSpeechBubble.textContent = userInput.value
    userInput.value = ''
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
})


async function fetchReply() {
     
     get(conversationInDb).then(async (snapshot) => {
        if (snapshot.exists()) {
            const conversationArr = Object.values(snapshot.val())
           
            conversationArr.unshift(instructionObj)
            /*
            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: conversationArr,
                presence_penalty: 0,
                frequency_penalty: 0.3
            })
            */
            const url = 'https://chat-bot-test-openai.netlify.app/.netlify/functions/fetchApiKey'

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Usa 'application/json'
                },
                body: JSON.stringify({messages: conversationArr}) // Stringifica e usa un oggetto per il corpo
            });
            const data = await response.json();
            console.log(data);
            
            push(conversationInDb, data.reply)
            renderTypewriterText(data.reply.content)
        }
        else {
            console.log('No data available')
        }

    })
    
}

function renderTypewriterText(text) {
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor')
    chatbotConversation.appendChild(newSpeechBubble)
    let i = 0
    const interval = setInterval(() => {
        newSpeechBubble.textContent += text.slice(i-1, i)
        if (text.length === i) {
            clearInterval(interval)
            newSpeechBubble.classList.remove('blinking-cursor')
        }
        i++
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    }, 50)
}

document.getElementById('clear-btn').addEventListener('click', () => {
    remove(conversationInDb)
    chatbotConversation.innerHTML = '<div class="speech speech-ai">How can I help you?</div>'
})


function renderConversationFromDb(){
    get(conversationInDb).then(async (snapshot)=>{
        if(snapshot.exists()) {
            Object.values(snapshot.val()).forEach(dbObj => {
                const newSpeechBubble = document.createElement('div')
                newSpeechBubble.classList.add(
                    'speech',
                    `speech-${dbObj.role === 'user' ? 'human' : 'ai'}`
                    )
                chatbotConversation.appendChild(newSpeechBubble)
                newSpeechBubble.textContent = dbObj.content
            })
            chatbotConversation.scrollTop = chatbotConversation.scrollHeight
        }
    })
}

renderConversationFromDb()
/*
async function fetchFactAnswer(){
    const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        //prompt: `Where are the 2001 Wimbledon tennis championschips held? `,
        prompt: `Who won it that year? `,
        max_tokens: 60
    })
    console.log(response.choices[0].text)
}
fetchFactAnswer()
*/
