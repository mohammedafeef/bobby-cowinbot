require('dotenv').config();
const { findAll } = require('./Channels');
const { getSessionByDistrict, getSessionByDistrictForWeek } = require('./apiRequest');
const Discord = require('discord.js');
const client = new Discord.Client();
const checkAvailability = async ()=>{
    const usersData = await findAll();
    usersData.forEach((user)=>{
        // console.log(user.name,'\n');
        if(user.notify_state && user.district && user.age){
            checkSlotByDistrict(user.user_id,user.district,user.age)
        }
    })
}

const checkSlotByDistrict = async (id,district,age) =>{
    const sessions = await getSessionByDistrictForWeek(district);
    let member = await client.users.fetch(id);
    console.log(sessions);
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
        }else{
            member.send('no slot');
        }
    }else{
        member.send('no slot')
    }

}
client.login(process.env.DISCORD_BOT_TOKEN)
module.exports = {
    checkAvailability
}
