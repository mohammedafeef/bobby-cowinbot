//configuaring the env like API keys
require('dotenv').config();
//importing essential modules
const Discord = require('discord.js');
const client = new Discord.Client();

//importing the database methods
const user = require('./Channels');

//importing meta data of districts 
const { districtId } = require('./districtId');

//importing notify script 
const { checkAvailability } = require('./notifyScript');
// const districtId = {
//     "malappuram":152,
//     "kozhikode":150
// }

const cronJob = require('cron').CronJob;
//cowin api request handler module
const cowinApi = require('./apiRequest');
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
    // structure to run fun in every hour 0 * * * *

    let notifyJob = new cronJob('0 * * * *',()=>{
        console.log("i am here with you");
        checkAvailability();
    })
    notifyJob.start();
})

//for sending welcoming message to new users
client.on('guildMemberAdd',member =>{
    console.log(member.id);
    member.send("hai :smiley:,welcome to the server \n type **$help** to more about me");
    let userData = {
        user_id:message.author.id,
        name:message.author.username
    }
    user.insertUser(userData);

});

//event to fire when the user is removed
client.on('guildMemberRemove',member=>{
    console.log(member.user.username);
    user.deletUser(member.user.id);
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
                    message.channel.send(`hai watsup <@${data.user_id}>`);
                }else{
                    message.channel.send("Hai ,please do set your credentials\nby typing the **$set** command")
                }
            }
        );
    }
    //handling the hello and the hai message
    if(['hai','hello'].includes(message.content.toLowerCase())){
        console.log(`[${message.author}]${message.content}`)
        checkAvailability();
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
            if(args.length){
                if(districtId.filter((dist)=>dist.district_name.toLowerCase() === args[0].toLowerCase())){
                    user.updateUser(message.author.id,{district:args[0]});
                    message.channel.send('district is updated');
                }else{
                    message.channel.send('Please, check the district name and correct it');
                }
            }else{
                message.channel.send('Enter district after the **$district**');
            }

        }else if(CMD_NAME === 'age'){
            let age = parseInt(args[0]);
            if(args.length){
                if(!isNaN(age)){
                    user.updateUser(message.author.id,{age:age});
                    message.channel.send('Age is updated');
                }else{
                    message.channel.send('Invalid age');
                }
            }else{
                message.channel.send('Enter age after the **$age**')
            }

        }else if (CMD_NAME === 'check_slot'){
            user.findUser(message.author.id)
            .then((data)=>{
                if(data){
                    message.channel
                    .send(`<@${data.user_id}>:satellite: checking the slots on\n\t :arrow_forward: district : ${data.district}\n\t :arrow_forward: pincode: ${data.pincode}\n\t :arrow_forward: age_group : ${(data.age)>45?'45+':(data.age<=18)?'miner':'18+'}`);
                    // const distId = districtId.find(dis=>dis.district_name.toLowerCase() === data.district.toLowerCase());
                    // let date = new Date();
                    // date = `${date.getDate()}-${date.getMonth()+1}-${date.getYear()+1900}`;
                    // console.log(distId,date,"\n");
                    //working district id is 137
                    cowinApi.getSessionByDistrict(data.district)
                    .then((data)=>{
                        // console.log(data);
                        if(data.sessions.length){
                            message.channel.send('there are some slots :smiley:\n')
                            console.log(data.sessions);
                            let centers = '';
                            data.sessions.forEach(center => {
                                centers = centers.concat(` :hospital: ${center.name}(${center.pincode})   :syringe: **${center.available_capacity}**\n`);
                            });
                            message.channel.send(centers);
                            const exampleEmbed = new Discord.MessageEmbed()
                            .setColor('#FFFFFF')
                            .setThumbnail('https://prod-cdn.preprod.co-vin.in/assets/images/covid19logo.jpg')
                            .setTitle('Register for Vacination')
                            .setURL('https://selfregistration.cowin.gov.in/')
                            .setImage('https://imgk.timesnownews.com/media/cowin_app.jpg')
                            .setTimestamp()
                            .setFooter('go and register quickly', 'https://prod-cdn.preprod.co-vin.in/assets/images/covid19logo.jpg');

                            message.channel.send(exampleEmbed);  
                        }else{
                            message.channel.send('Currently there are no :syringe:slots :cry:')

                        }
                    })
                }else{
                    message.channel.send('Hai ,please do set your credentials\nby typing the **$set** command');
                }
            })
            .catch(err=>console.log(err))
            // message.channel.send(message.channel.id);
            // message.channel.send('Checking for the slot in the given district');
        }else if(CMD_NAME === 'check_slot_pin'){
            
            user.findUser(message.author.id)
            .then((data)=>{
                if(data.pincode){
                    message.channel
                    .send(`<@${data.user_id}>checking the slots on\n\t :arrow_forward: pincode: ${data.pincode}\n\t :arrow_forward: age_group : ${(data.age)>45?'45+':(data.age<=18)?'miner':'18+'}`);
                    const distId = districtId.find(dis=>dis.district_name.toLowerCase() === data.district.toLowerCase());
                    let date = new Date();
                    date = `${date.getDate()}-${date.getMonth()+1}-${date.getYear()+1900}`;
                    console.log(distId,date,"\n");
                    // let ageGroup = (data.age<45)?((data.age<18)?"minor":'18'):'45';
                    let age = data.age;
                    cowinApi.getSessionByPin(data.pincode,date)
                    .then((slots)=>{
                        // console.log(slots);
                        if(slots.sessions.length){
                            message.channel.send('there are some slots :smiley:\n')
                            console.log(slots.sessions);
                            let centers = '';
                            slots.sessions.forEach(center => {
                                centers = (age >= center.min_age_limit)?centers.concat(`${center.available_capacity} in ${center.name} \n`):centers;
                            });
                            message.channel.send(centers);
                            const exampleEmbed = new Discord.MessageEmbed()
                            .setColor('#FFFFFF')
                            .setThumbnail('https://prod-cdn.preprod.co-vin.in/assets/images/covid19logo.jpg')
                            .setTitle('Register for Vacination')
                            .setURL('https://selfregistration.cowin.gov.in/')
                            .setImage('https://imgk.timesnownews.com/media/cowin_app.jpg')
                            .setTimestamp()
                            .setFooter('go and register quickly', 'https://prod-cdn.preprod.co-vin.in/assets/images/covid19logo.jpg');

                            message.channel.send(exampleEmbed);  
                        }else{
                            message.channel.send('currently there are no slots :cry: check later')

                        }
                    })
                }else{
                    message.channel.send('do set your pincode by typing \n **$pincode** your_pincode like $pincode 112233');
                }
            })
            .catch(err=>console.log(err))

        }else if (CMD_NAME === 'pincode'){
            let pincode = parseInt(args[0]);
            if(args.length){
                if(!isNaN(pincode)){
                    user.updateUser(message.author.id,{pincode:pincode});
                    message.channel.send('pincode is setted');
                }else{
                    message.channel.send('enter valid pincode');
                }
            }else{
                message.channel.send('enter the pincode after **$pincode**')
            }

        }else if(CMD_NAME === 'set_all'){
            user.findUser(message.author.id)
            .then((data)=>{
                if(data.district && data.pincode && data.age){
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
                                // let userData = {
                                //     user_id:message.author.id,
                                //     name:message.author.username,
                                //     district:district,
                                //     age:parseInt(age),
                                //     pincode:parseInt(pincode)
                                // }
                                // user.insertUser(userData);
                                let details = {
                                    age:parseInt(age),
                                    pincode:parseInt(pincode),
                                    district:district
                                }
                                Channel.updateUser(message.author.id,details);
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
client.login(process.env.DISCORD_BOT_TOKEN)


