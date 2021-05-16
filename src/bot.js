//configuaring the env like API keys
require('dotenv').config();
//importing essential modules
const { Client } = require('discord.js');
const client = new Client();
//ready event emiter
client.on('ready',()=>{
    console.log(`${client.user.tag}`);
})
// setting responses for messages from the client
client.on('message',(message)=>{
    if(message.author.bot)return;
    if(message.content === 'hai'){
        console.log(`[${message.author}]${message.content}`)
        message.channel.send('hello');
    }else if(message.content === 'hello'){
        console.log(`[${message.author}]${message.content}`)
        message.channel.send('hello');
    }
});

//logging in to the bot
client.login(process.env.DISCORD_BOT_TOKEN);
