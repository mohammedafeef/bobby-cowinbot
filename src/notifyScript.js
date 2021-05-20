require('dotenv').config();
const { findAll } = require('./Channels');
const { getSessionByDistrict } = require('./apiRequest');
const Discord = require('discord.js');
const client = new Discord.Client();
const checkAvailability = async ()=>{
    const usersData = await findAll();
    usersData.forEach((user)=>{
        // console.log(user.name,'\n');
        checkSlotByDistrict(user.user_id,user.district,user.age)
    })
}

const checkSlotByDistrict = async (id,district,age) =>{
    const sessions = await getSessionByDistrict(district);
    console.log(id,'\n',sessions);
    let member = await client.users.fetch(id);
    if(sessions.length){
        member.send('there are some slots :smiley:\n');
        console.log(sessions);
        let centers = '';
        sessions.forEach(center => {
            centers = centers.concat(`${center.available_capacity} in ${center.name} (${center.pincode}) for ${center.min_age_limit}+ \n`);
        });
        member.send(centers);
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#FFFFFF')
        .setThumbnail('https://prod-cdn.preprod.co-vin.in/assets/images/covid19logo.jpg')
        .setTitle('Register for Vacination')
        .setURL('https://selfregistration.cowin.gov.in/')
        .setImage('https://imgk.timesnownews.com/media/cowin_app.jpg')
        .setTimestamp()
        .setFooter('go and register quickly', 'https://prod-cdn.preprod.co-vin.in/assets/images/covid19logo.jpg');

        member.send(exampleEmbed);  
    }else{
        member.send('currently there are no slots :cry: check later')

    }
}
client.login(process.env.DISCORD_BOT_TOKEN)
module.exports = {
    checkAvailability
}
