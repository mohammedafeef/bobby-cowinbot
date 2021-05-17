//configuaring the env like API keys
require('dotenv').config();
//importing essential modules
const Discord = require('discord.js');
const client = new Discord.Client();

//importing the database methods
const user = require('./Channels');

const districtId = {
    "malappuram":152,
    "kozhikode":150
}
//command prefix
const PREFIX = '$';
botMentionId = '<@!843371650959409202> ';
//ready event emiter
client.on('ready',()=>{
    console.log(`${client.user.tag}`);
    // client.channels.fetch('843390455777460247')
    // .then(channel =>{
    //     channel.send( `:stop_sign: Enter **${PREFIX}help** to get all the commands :stop_sign:`);
    // })
})
// setting responses for messages from the client
client.on('message',(message)=>{
    //return if the message from the bot it self
    if(message.author.bot)return;
    if(message.mentions.has(client.user.id)){
        const userData = user.findUser(message.author.id);
        console.log(userData);
        if(userData){
            message.channel.send(`hai watsup @${userData.name}`);
        }else{
            message.channel.send("Hai ,please do set your credentials\nby typing the **$set** command")
        }
    }
    if(['hai','hello'].includes(message.content.toLowerCase())){
        console.log(`[${message.author}]${message.content}`)
        message.channel.send(
            message.content.toLowerCase() === 'hai'?'hello':'hai'
        );
    }else if(message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
        .toLowerCase()
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);
        // console.log("command is :",CMD_NAME,"\n arguments",args)
        // each command handles here
        if(CMD_NAME === 'help'){
            message.channel.send(`:mobile_phone: **commands**\n\n\t:loudspeaker:  ${PREFIX}district : To set the district \n\t:loudspeaker:  ${PREFIX}age : To set the age\n\n must use **${PREFIX}** as command prefix\n`)

        }else if(CMD_NAME === 'district'){
            if(districtId.hasOwnProperty(args[0].toLowerCase())){
                message.channel.send('district has been setted');
            }else{
                message.channel.send('please, check the district name and correct it');
            }
        }else if(CMD_NAME === 'age'){
            let age = parseInt(args[0]);
            if(!isNaN()){
                if(age < 18){
                    message.channel.send('your not grown much to vaccinate')
                }else if(age >45){
                    message.channel.send("age has been setted");
                }else{
                    message.channel.send('age has been setted');
                }
            }else{
                message.channel.send('enter an valid age')
            }
        }else if (CMD_NAME === 'checkslots'){
            console.log(message.channel.id);
            message.channel.send(message.channel.id);
            message.channel.send('Checking for the slot in the given district');
        }else if (CMD_NAME === 'pincode'){
            let pincode = Number(args[0]);
            if(!isNaN(pincode)){
                message.channel.send('pincode is setted');
            }else{
                message.channel.send('enter valid pincode');
            }
        }else if(CMD_NAME === 'set'){
            if(user.findUser(message.author.id)){
                message.channel.send('your already added check**$help** to modify them')
            }else{
                let filter = m => m.author.id === message.author.id;
                message.channel.send('Do send your pincode,district and age in following format\n ** pincode district age ** \n like 676306 malappuram 20');
                let isCreated = false;
                while(isCreated){
                    message.channel.awaitMessages(filter,{
                        max:1,
                        time:30000,
                        errors: ['time']
                    })
                    .then(Response =>{
                        const [...data] = Response
                        .trim()
                        .split(/\s+/);
                        
                    })
                    .catch(err => {
                        message.channel.send("enter valid data in ** pincode district age ** format");
                    })
                }
            }
        }
    }
});

//logging in to the bot
client.login(process.env.DISCORD_BOT_TOKEN);
