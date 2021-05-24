require('dotenv').config();
const { findAll } = require('./db/Channels');
const { districtId } = require('./cowinApi/districtId');
const { getSessionByDistrictForWeek } = require('./cowinApi/apiRequest');
const Discord = require('discord.js');
const client = new Discord.Client();
//To all users data from db and the slot checking function
const checkAvailability = async ()=>{
    const usersData = await findAll();
    const slotKerala = await getSessionByKerala();
    usersData.forEach((user)=>{
        if(user.notify_state && user.district && user.age){
            let userDistSlot = slotKerala.find((data)=>data.district.toLowerCase() === user.district.toLowerCase());
            checkSlotByDistrict(user.user_id,user.age,userDistSlot.slot);
        }
    })
}
//check slot in given district
const checkSlotByDistrict = async (id,age,sessions) =>{
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
        if(slots.length && !member.bot){
            member.send('There are some slots :smiley:\n')
            member.send(slots);
            const exampleEmbed = new Discord.MessageEmbed()
            .setTitle('Register for Vacination')
            .setURL('https://selfregistration.cowin.gov.in/')
            .setImage('https://imgk.timesnownews.com/media/cowin_app.jpg');

            member.send(exampleEmbed);
        }
    }

}
//To the slot availability in all districts of kerala
const getSessionByKerala = async ()=>{
    //To resole the array of promises
    let slotKerala = await Promise.all(districtId.map(async (district)=>{
        let sessions = await getSessionByDistrictForWeek(district.district_name);
        return ({
            district:district.district_name,
            slot:sessions

        })
    }))
    return slotKerala;
}
//loging in to the bot
client.login(process.env.DISCORD_BOT_TOKEN)

module.exports = {
    checkAvailability
}
