require('dotenv').config();
const { findAll } = require('./db/Channels');
const { getSessionByDistrictForWeek } = require('./cowinApi/apiRequest');
const Discord = require('discord.js');
const client = new Discord.Client();
//To all users data from db and the slot checking function
const checkAvailability = async ()=>{
    const usersData = await findAll();
    usersData.forEach((user)=>{
        if(user.notify_state && user.district && user.age){
            checkSlotByDistrict(user.user_id,user.district,user.age)
        }
    })
}
//check slot in given district
const checkSlotByDistrict = async (id,district,age) =>{
    //fetch data from cowin api
    const sessions = await getSessionByDistrictForWeek(district);
    //fetch users data from the discord api
    let member = await client.users.fetch(id);
    //checks if slot are available or not
    if(sessions.centers.length){
        let slots = '';
        sessions.centers.forEach(center => {
            let spot = center.sessions.find((session)=>(session.available_capacity >0 && session.min_age_limit <= age))
            if(spot){
                slots = slots.concat(` :hospital: ${center.name}(${center.pincode})   :syringe: **${spot.available_capacity}**\n`)
            }
        });
        if(slots.length){
            member.send('there are some slots :smiley:\n')
            member.send(slots);
            const exampleEmbed = new Discord.MessageEmbed()
            .setTitle('Register for Vacination')
            .setURL('https://selfregistration.cowin.gov.in/')
            .setImage('https://imgk.timesnownews.com/media/cowin_app.jpg');

            member.send(exampleEmbed);
        }
    }

}
//loging in to the bot
client.login(process.env.DISCORD_BOT_TOKEN)

module.exports = {
    checkAvailability
}
