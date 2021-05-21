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
    // console.log(id,'\n',sessions);
    let member = await client.users.fetch(id);
    if(sessions.centers.length){
        member.send('there are some slots :smiley:\n');
        // console.log(c);
        let slots = '';
        data.centers.forEach(center => {
            center.sessions.forEach(session =>{
                if(session.available_capacity >0 && session.min_age_limit >= age){
                    slots = slots.concat(` :hospital: ${center.name}(${center.pincode})   :syringe: **${session.available_capacity}**\n`);
                }
            })
        });
        if(slots.length){
            member.send('there are some slots :smiley:\n')
            member.send(slots);
            const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#FFFFFF')
            .setThumbnail('https://prod-cdn.preprod.co-vin.in/assets/images/covid19logo.jpg')
            .setTitle('Register for Vacination')
            .setURL('https://selfregistration.cowin.gov.in/')
            .setImage('https://imgk.timesnownews.com/media/cowin_app.jpg')
            .setTimestamp()
            .setFooter('go and register quickly', 'https://prod-cdn.preprod.co-vin.in/assets/images/covid19logo.jpg');

            member.send(exampleEmbed);
        }
    }

}
client.login(process.env.DISCORD_BOT_TOKEN)
module.exports = {
    checkAvailability
}
