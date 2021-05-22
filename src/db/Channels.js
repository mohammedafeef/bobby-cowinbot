require('dotenv').config()
const { Channel } = require('./model.js');
const mongoose = require('mongoose');
// creating the connection to mongodb
// mongoose.connect('mongodb://localhost:27017/bobby',{useNewUrlParser: true});
mongoose.connect(
    process.env.MONGO_SERVER_ROUTE
    ,{
        useNewUrlParser: true,
        useUnifiedTopology:true
    }
    )
    .then(()=>console.log('successfully logged in '))
    .catch((err)=>console.log('login failed'));
//insert an collection
const updateUser = (id,updatedData)=>{
    Channel.updateOne(
        {user_id:id},
        updatedData,
        (err)=>{
            console.log(err)
        }  
    )
}
//get all registered users data from the db
const findAll = ()=>{
    return Channel.find({},
        (err,data)=>{
            if(err || !data){
                return "failed"
            }
            return data;
        }
        
        )
}
//To find the user data
const findUser = (id)=>{
    return Channel.findOne(
        {user_id:id},
        (err,data)=>{
            if(err || !data){
                return 0;
            }
            return data;
        })
};

//To insert new user data
const insertUser = (data)=>{
    const user = new Channel(data);
    Channel.insertMany([user],(err)=>{
        console.log(err);
    });
}
//to delete a document
const deletUser = (userId)=>{
    Channel.deleteOne({
        user_id:userId
    }
    ,(err)=>console.log(err)
    )
}
//exporting db curd functions
module.exports ={
    insertUser,
    findUser,
    updateUser,
    findAll,
    deletUser
};