const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//schema of the models
const channelSchema = new Schema ({
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

});

//models of the cowin app
const Channel = mongoose.model(
    'channel',
    channelSchema
);
module.exports = {
    Channel
};