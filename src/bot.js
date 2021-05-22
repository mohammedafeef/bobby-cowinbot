//configuaring the env like API keys
require('dotenv').config();
//importing essential modules
const Discord = require('discord.js');
const client = new Discord.Client();

//importing the database methods
const user = require('./db/Channels');

//importing notify script 
const { checkAvailability } = require('./notifyScript');

const {districtId} = require('./cowinApi/districtId');
// to filter the message
let filter = m => m.author.id === message.author.id;
//job scheduler script
const cronJob = require('cron').CronJob;
//cowin api request handler module
const cowinApi = require('./cowinApi/apiRequest');
//command prefix
const PREFIX = '$';
botMentionId = '<@!843371650959409202> ';
//ready event emiter
client.on('ready',()=>{
    console.log(`${client.user.tag}`);
    // structure to run fun in every hour 0 * * * *
    let notifyJob = new cronJob(' 0 * * * *',()=>{
        checkAvailability();
    })

    notifyJob.start();
})

//for sending welcoming message to new users
client.on('guildMemberAdd',member =>{
    user.findUser(member.id)
    .then((data)=>{
        if(data){
            member.send(`Hi <@${data.user_id}>,glad to meet you here again`)
        }else{
            member.send(`Hi , watsup <@${member.user.id}> bobby is here to help you\n check **$help** more details`);
            let userData = {
                user_id:member.user.id,
                name:member.user.username,
                notify_state:1
            }
            user.insertUser(userData);
        }
        console.log(`[ ${member.user.tag}]: ADD`)
    })
});

//event to fire when the user is removed
client.on('guildMemberRemove',member=>{
    user.findUser(member.id)
    .then((data)=>{
        if(data){
            console.log(`[ ${member.user.tag}]: REM`)
            user.deletUser(member.user.id);
        }
    })

})
// setting responses for messages from the client
client.on('message',(message)=>{
    //return if the message from the bot it self
    if(message.author.bot)return;
    //check for bot mentioned message
    if(message.mentions.has(client.user.id)){
        user.findUser(message.author.id)
        .then(
            (data)=>{
                if(data){
                    message.channel.send(`Hi <@${data.user_id}>, glad you to meet again`);
                }else{
                    message.channel.send(`Hi , watsup <@${message.author.id}> bobby is here to help you\n check **$help** more details`)
                }
            }
        );
    }
    //handling the hello and the hai message
    if(['hai','hello'].includes(message.content.toLowerCase())){

        message.channel.send(
            message.content.toLowerCase() === 'hai'?'hello':'hai'
        );
    }
    //This handles all the commands
    else if(message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
        .toLowerCase()
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);
        // checks which command is user typed
        if(CMD_NAME === 'help'){
            //Give an idea about each command
            message.channel.send(`
            :mobile_phone: **Commads to interact with boby**
                :loudspeaker:  ${PREFIX}details : show your data
            **To update the data**
                :loudspeaker:  ${PREFIX}district : update the district 
                :loudspeaker:  ${PREFIX}age : update the age 
                :loudspeaker:  ${PREFIX}pin : update the pincode
                :loudspeaker:  ${PREFIX}set_all : update all
            **To check the slot**
                :loudspeaker:  ${PREFIX}slot_district : slots in district 
                :loudspeaker:  ${PREFIX}slot_pin : slots in pincode
            **To change notification state**
                :loudspeaker:  ${PREFIX}notify_on : enable hourly slot notifier
                :loudspeaker:  ${PREFIX}notify_off : disable hourly slot notifier
            Must use **${PREFIX}** as command prefix
            `)

        }else if(CMD_NAME == 'details'){
            //To check all the current details available
            user.findUser(message.author.id)
            .then((data)=>{
                if(!data){
                    user.insertUser({
                        user_id:message.author.id,
                        notify_state:1,
                        name:message.author.username
                    })
                    message.channel.send(`
                    **Your details**
                    **Name**   ${message.author.username}
                    **Age**    Not updated
                    **Pincode** Not updated
                    **District** Not updated
                    **notify_state** on
                    `)
                }else{
                    message.channel.send(`
                    **Your details**
                    **Name**    ${data.name}
                    **Age**     ${data.age?data.age:'Not updated'}
                    **Pincode**  ${data.pincode?data.pincode:'Not updated'}
                    **District** ${data.district?data.district:'Not updated'}
                    **Notier** ${data.notify_state?'on':'off'}
                    `)
                }
            })

        }
        else if(CMD_NAME === 'district'){
            //To update the district name
            user.findUser(message.author.id)
            .then((data)=>{
                if(!data){
                    user.insertUser({
                        user_id:message.author.id,
                        notify_state:1,
                        name:message.author.username
                    })
                }
            })
            let filter = m => m.author.id === message.author.id;
            message.channel.send(`<@${message.author.id}> Enter your district name`);
            //wait for the users response
            message.channel.awaitMessages(filter,{
                max:1,
                time:200000,
                errors: ['time']
            })
            .then(res =>{
                res = res.first().content;
                const [district] = res
                .toLowerCase()
                .trim()
                .split(/\s+/);
                if(districtId.filter((dist)=>dist.district_name.toLowerCase() === district.toLowerCase())[0]){
                    user.updateUser(message.author.id,{district:district});
                    console.log(`[ ${message.author.tag}]: U - D`)
                    message.channel.send(`<@${message.author.id}>District is updated`);
                }else{
                    message.channel.send(`<@${message.author.id}>Please, check the district name and correct it`);
                }   
            })


        }else if(CMD_NAME === 'age'){
            //To update the age
            user.findUser(message.author.id)
            .then((data)=>{
                if(!data){
                    user.insertUser({
                        user_id:message.author.id,
                        notify_state:1,
                        name:message.author.username
                    })
                }
            })
            let filter = m => m.author.id === message.author.id;
            message.channel.send(`<@${message.author.id}> Enter your age`);
            message.channel.awaitMessages(filter,{
                max:1,
                time:200000,
                errors: ['time']
            })
            .then(res =>{
                res = res.first().content;
                const [age] = res
                .toLowerCase()
                .trim()
                .split(/\s+/);
                if(!isNaN(age) && age>0 && age <100){
                    user.updateUser(message.author.id,{age:age});
                    console.log(`[ ${message.author.tag}]: U - A`)
                    message.channel.send(`<@${message.author.id}>Age is updated`);
                }else{
                    message.channel.send(`<@${message.author.id}>Invalid age`);
                }
                
                
            })

        }else if(CMD_NAME === 'notify_on'){
            //To on the notifier
            user.findUser(message.author.id)
            .then((data)=>{
                if(!data){
                    user.insertUser({
                        user_id:message.author.id,
                        notify_state:1,
                        name:message.author.username
                    })
                    message.channel.send(`
                    Update your age and distirct 
                    check the **${PREFIX}help** command
                    `);
                }else{
                    user.updateUser(message.author.id,{notify_state:1});
                }
            })
            console.log(`[ ${message.author.tag}]: N - O`)
            message.channel.send('I will notify you when there have slot :smiley:')
        }else if(CMD_NAME === 'notify_off'){
            //To off the notifier
            user.findUser(message.author.id)
            .then((data)=>{
                if(!data){
                    user.insertUser({
                        user_id:message.author.id,
                        notify_state:0,
                        name:message.author.username
                    })
                    message.channel.send(`
                    Update your age and distirct 
                    check the **${PREFIX}help** command
                    `);
                }else{
                    user.updateUser(message.author.id,{notify_state:0});
                }
            })
            console.log(`[ ${message.author.tag}]: N - F`)
            message.channel.send('Hourly notification is disabled:cry:')
        }
        else if (CMD_NAME === 'slot_district'){
            //To check the slot in given distict
            user.findUser(message.author.id)
            .then((data)=>{
                if(data.district && data.age>17){
                    message.channel
                    .send(`
                    <@${data.user_id}>:satellite: checking the slots on
                        :arrow_forward: district : ${data.district}
                        :arrow_forward: age_group : ${(data.age)>45?'45+':(data.age<18)?'miner':'18+'}`);
                    let age = data.age;
                    cowinApi.getSessionByDistrictForWeek(data.district)
                    .then((data)=>{
                        console.log(`[ ${message.author.tag}]: S - D`)
                        if(data.centers.length){
                            let slots = '';
                            data.centers.forEach(center => {
                                let spot = center.sessions.find((session)=>(session.available_capacity >0 && session.min_age_limit <= age))
                                if(spot){
                                    slots = slots.concat(` :hospital: ${center.name}   :syringe: **${spot.available_capacity}**\n`)
                                }
                            });
                            if(slots.length){
                                message.channel.send('There are some slots :smiley:\n')
                                message.channel.send(slots);
                                const exampleEmbed = new Discord.MessageEmbed()
                                .setTitle('Register for Vacination')
                                .setURL('https://selfregistration.cowin.gov.in/')
                                .setImage('https://imgk.timesnownews.com/media/cowin_app.jpg');
    
                                message.channel.send(exampleEmbed);
                            }else{
                                message.channel.send('Currently there are no :syringe:slots :cry:')
                            }
  
                        }else{
                            message.channel.send('Currently there are no :syringe:slots :cry:')

                        }
                    })
                }else{
                    message.channel.send('Please,Do set your $district and $age\n for more details check **$help**');
                }
            })
            .catch(err=>console.log(err))
        }else if(CMD_NAME === 'slot_pin'){
            //To check the slot in your pincode
            user.findUser(message.author.id)
            .then((data)=>{
                if(data.pincode && data.age){
                    message.channel
                    .send(`
                    <@${data.user_id}>:satellite: checking the slots on
                        :arrow_forward: pincode : ${data.pincode}
                        :arrow_forward: age_group : ${(data.age)>=45?'45+':(data.age<18)?'miner':'18+'}`);

                    let age = data.age;
                    cowinApi.getSessionByPinForWeek(data.pincode)
                    .then((data)=>{
                        console.log(`[ ${message.author.tag}]: S - P`)
                        if(data.centers.length){
                            let slots = '';
                            data.centers.forEach(center => {
                                let spot = center.sessions.find((session)=>(session.available_capacity >0 && session.min_age_limit <= age))
                                if(spot){
                                    slots = slots.concat(` :hospital: ${center.name}   :syringe: **${spot.available_capacity}**\n`)
                                }
                            });
                            if(slots.length){
                                message.channel.send("There are some slots :smiley:\n")
                                message.channel.send(slots);
                                const exampleEmbed = new Discord.MessageEmbed()
                                .setTitle('Register for Vacination')
                                .setURL('https://selfregistration.cowin.gov.in/')
                                .setImage('https://imgk.timesnownews.com/media/cowin_app.jpg');
    
                                message.channel.send(exampleEmbed); 
                            }else{
                                message.channel.send('Currently there are no slots :cry: check later') 
                            }
 
                        }else{
                            message.channel.send('Currently there are no slots :cry: check later')

                        }
                    })
                }else{
                    message.channel.send('Do set your pincode and age \n for more details check **$help**');
                }
            })
            .catch(err=>console.log(err))

        }else if (CMD_NAME === 'pincode'){
            //To update the pincode 
            user.findUser(message.author.id)
            .then((data)=>{
                if(!data){
                    user.insertUser({
                        user_id:message.author.id,
                        notify_state:1,
                        name:message.author.username
                    })
                }
            })
            let filter = m => m.author.id === message.author.id;
            message.channel.send(`<@${message.author.id}> Enter your pincode`);
                message.channel.awaitMessages(filter,{
                    max:1,
                    time:200000,
                    errors: ['time']
                })
                .then(res =>{
                    res = res.first().content;
                    const [pincode] = res
                    .toLowerCase()
                    .trim()
                    .split(/\s+/);
                    if(!isNaN(pincode) && pincode <999999 && pincode >100000){
                        user.updateUser(message.author.id,{pincode:pincode});
                        console.log(`[ ${message.author.tag}]: U - P`)
                        message.channel.send('Pincode is updated');
                    }else{
                        message.channel.send('Invalid pincode');
                    }
                    
                    
                })

        }else if(CMD_NAME === 'set_all'){
            //To update all data in one go
            let filter = m => m.author.id === message.author.id;
            message.channel.send('Do send your pincode,district and age in following format\n ** pincode district age ** \n like 676306 malappuram 20');
            message.channel.awaitMessages(filter,{
                max:1,
                time:200000,
                errors: ['time']
            })
            .then(res =>{
                res = res.first().content;
                const [pincode,district,age] = res
                .toLowerCase()
                .trim()
                .split(/\s+/);
                if(!isNaN(pincode) 
                && !isNaN(age) 
                && districtId.filter((dist)=>dist.district_name.toLowerCase() === district.toLowerCase())
                && age>0
                && age<100
                ){

                    let details = {
                        age:parseInt(age),
                        pincode:parseInt(pincode),
                        district:district
                    }
                    user.updateUser(message.author.id,details);
                    console.log(`[ ${message.author.tag}]: U - All`)
                    message.channel.send(':space_invader: your data saved check **$help** for checking the :slots');
                }else{
                    message.channel.send('invalid data try again with **$set** command');
                }
                
                
            })
        }
    }
});

//logging in to the bot
client.login(process.env.DISCORD_BOT_TOKEN)


