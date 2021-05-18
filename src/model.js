const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Channel = mongoose.model(
    'channel',
    new Schema ({
        user_id:{
            type:String
        },
        district:{
            type:String
        },
        pincode:{
            type:Number
        },
        age:{
            type:Number
        },
        name:{
            type:String
        }

    })
);
module.exports = {
    Channel
};