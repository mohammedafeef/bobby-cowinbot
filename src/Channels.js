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
            console.log((err)?err:`${id} updated`);
        }  
    )
}
const findAll = ()=>{
    return Channel.find({},
        (err,data)=>{
            if(err || !data){
                console.log('failed to get all');
                return "failed"
            }
            console.log('successfully fethched all');
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
                console.log('failed')
                return 0;
            }
            console.log('returned')
            return data;
        })
};

//To insert new user data
const insertUser = (data)=>{
    const user = new Channel(data);
    Channel.insertMany([user],(err)=>{
        err?console.log(err):console.log('inserted');
    });
}
//to delete a document
const deletUser = (userId)=>{
    Channel.deleteOne({
        user_id:userId
    }
    ,(err)=>console.log(err?err:"deleted")
    )
}
// const user = {
//     user_id:"124",
//     name:'azeeb',
//     district:"malappuram",
//     pincode:113344,
//     age:12
// }
// findUser('124').then((data)=>console.log(data));
//exporting the methods
module.exports ={
    insertUser,
    findUser,
    updateUser,
    findAll,
    deletUser
};