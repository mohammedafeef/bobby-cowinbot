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
            checkSlotByDistrict(user.user_id,user.age,user.district,userDistSlot.slot);
        }
    })
}
//check slot in given district
const checkSlotByDistrict = async (id,age,district,sessions) =>{
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
            member.send(`
            There are some slots :smiley:
            :arrow_forward: district : ${district}
            :arrow_forward: age_group : ${(age)>=45?'45+':(data.age<18)?'miner':'18+'}
            `)
            member.send(slots);
            const exampleEmbed = new Discord.MessageEmbed()
            .setTitle('Register for Vacination')
            .setURL('https://selfregistration.cowin.gov.in/')
            .setImage('https://imgk.timesnownews.com/media/cowin_app.jpg');

            member.send(exampleEmbed);
        }
    }
    await delay(100)

}
//To set an delay between to message
const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
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
