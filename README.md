![BFH Banner](https://trello-attachments.s3.amazonaws.com/542e9c6316504d5797afbfb9/542e9c6316504d5797afbfc1/39dee8d993841943b5723510ce663233/Frame_19.png)
<br>
[![node](https://badges.aleen42.com/src/node.svg)](https://nodejs.org/en/docs/)
[![npm](https://badges.aleen42.com/src/npm.svg)](https://www.npmjs.com/)
[![instagram](https://badges.aleen42.com/src/instagram.svg)](https://www.instagram.com/afeef._.maf/)
[![youtube](https://badges.aleen42.com/src/youtube.svg)](https://www.youtube.com/channel/UCSw6My2K1thRUnINark9J1Q)

# Bobby
Bobby is an cowin discord bot it helps to check the slot in district or pincode and it will inform you about the slot availability on hourly basis.

## Link to product walkthrough
https://www.loom.com/share/ce95607a0317449b818eb00f12d8517b

## How it Works ?
1. Works under a set of commands bot will list all them if you dm with $help.<br>
        :mobile_phone: **Commads to interact with boby**<br>
                :loudspeaker:  ${PREFIX}info : About bot<br>
                :loudspeaker:  ${PREFIX}profile : show your data<br>
            **To update the data**<br>
                :loudspeaker:  ${PREFIX}district : update the district <br>
                :loudspeaker:  ${PREFIX}age : update the age <br>
                :loudspeaker:  ${PREFIX}pin : update the pincode <br>
                :loudspeaker:  ${PREFIX}set_all : update above all in one go<br>
            **To check the slot**<br>
                :loudspeaker:  ${PREFIX}slot_district : slots in district <br>
                :loudspeaker:  ${PREFIX}slot_pin : slots in pincode<br>
            **To change notification state**<br>
                :loudspeaker:  ${PREFIX}notify_on : enable hourly slot notifier<br>
                :loudspeaker:  ${PREFIX}notify_off : disable hourly slot notifier<br>
            Must use **${PREFIX}** as command prefix<br>
2. You can update your details like age ,district ,pincode by respected command in above list.
3. After updating the details you will be able to check the slot by $slot_dist and $slot_pin.
4. You disable the notification by notify_off and enable back by the notify_on.
%. If the notier is on you will get dm from bot if the slot is available.
## Libraries used
- mongoose
- discord.js
- node-cron
- axios

## How to configure
 You can add bobby to your discord server by below link<br>
 https://discord.com/api/oauth2/authorize?client_id=843371650959409202&permissions=3758619712&scope=bot
