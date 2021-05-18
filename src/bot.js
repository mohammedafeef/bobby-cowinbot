//configuaring the env like API keys
require('dotenv').config();
//importing essential modules
const Discord = require('discord.js');
const client = new Discord.Client();

//importing the database methods
const user = require('./Channels');

//importing meta data of districts 
const { districtId } = require('./districtId');
// const districtId = {
//     "malappuram":152,
//     "kozhikode":150
// }
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
    //check for bot mentioned message
    if(message.mentions.has(client.user.id)){
        user.findUser(message.author.id).then(
            (data)=>{
                console.log(data);
                if(data){
                    message.channel.send(`hai watsup @${data.name}`);
                }else{
                    message.channel.send("Hai ,please do set your credentials\nby typing the **$set** command")
                }
            }
        );
    }
    //handling the hello and the hai message
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
            if(districtId.filter((dist)=>dist.district_name.toLowerCase() === args[0].toLowerCase())){
                user.updateUser(message.author.id,{district:args[0]});
                message.channel.send('district is updated');
            }else{
                message.channel.send('please, check the district name and correct it');
            }
        }else if(CMD_NAME === 'age'){
            let age = parseInt(args[0]);
            if(!isNaN(age)){
                user.updateUser(message.author.id,{age:age});
                message.channel.send('age is updated');
            }else{
                message.channel.send('invalid age');
            }
        }else if (CMD_NAME === 'checkslots'){
            user.findUser(message.author.id)
            .then((data)=>{
                if(data){
                    message.channel
                    .send(`checking the slots on\n\t :arrow_forward: district : ${data.district}\n\t :arrow_forward: pincode: ${data.pincode}\n\t :arrow_forward: age_group : ${(data.age)>45?'45+':(data.age<=18)?'miner':'18+'}`);
                }else{
                    message.channel.send('Hai ,please do set your credentials\nby typing the **$set** command');
                }
            })
            // message.channel.send(message.channel.id);
            // message.channel.send('Checking for the slot in the given district');
        }else if (CMD_NAME === 'pincode'){
            let pincode = parseInt(args[0]);
            if(!isNaN(pincode)){
                user.updateUser(message.author.id,{pincode:pincode});
                message.channel.send('pincode is setted');
            }else{
                message.channel.send('enter valid pincode');
            }
        }else if(CMD_NAME === 'set'){
            user.findUser(message.author.id)
            .then((data)=>{
                if(data){
                    message.channel.send('your already added check **$help** to modify them')
                }else{
                    let filter = m => m.author.id === message.author.id;
                    message.channel.send('Do send your pincode,district and age in following format\n ** pincode district age ** \n like 676306 malappuram 20');
                    let isCreated = false;
                    // while(!isCreated){
                        console.log('entered to the loop');
                        message.channel.awaitMessages(filter,{
                            max:1,
                            time:200000,
                            errors: ['time']
                        })
                        .then(res =>{
                            res = res.first().content;
                            console.log('replied:',res);
                            const [pincode,district,age] = res
                            .toLowerCase()
                            .trim()
                            .split(/\s+/);
                            //checking the rules in the 
                            if(!isNaN(pincode) 
                            && !isNaN(age) 
                            && districtId.filter((dist)=>dist.district_name.toLowerCase() === district.toLowerCase())
                            && age>0
                            && age<100
                            ){
                                let userData = {
                                    user_id:message.author.id,
                                    name:message.author.username,
                                    district:district,
                                    age:parseInt(age),
                                    pincode:parseInt(pincode)
                                }
                                user.insertUser(userData);
                                message.channel.send(':space_invader: your data saved check **$help** for checking the :slots');
                                iscreated = true;
                            }else{
                                message.channel.send('invalid data try again with **$set** command');
                            }
                            
                            
                        })
                        .catch(err => {
                            message.channel.send("invalid data try again with **$set** command");
                        })
                    // }
                }
            }
            )
        }
    }
});

//logging in to the bot
client.login(process.env.DISCORD_BOT_TOKEN);
