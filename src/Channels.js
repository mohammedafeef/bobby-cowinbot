const { Channel } = require('./model.js');
const mongoose = require('mongoose');
// creating the connection to mongodb
mongoose.connect('mongodb://localhost:27017/bobby',{useNewUrlParser: true});

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
//To find the user data
const findUser = (id)=>{
    return Channel.findOne(
        {user_id:id},
        (err,data)=>{
            if(err || !data){
                console.log('failed')
                return "failed";
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
    updateUser
};