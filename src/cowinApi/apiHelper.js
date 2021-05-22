const {districtId} = require('./districtId')
//To get current date if its evening it will get tomorrow date
const getTodayDate =()=>{
    let date = new Date();
    if(date.getHours() >18){
        date.setDate(date.getDate() + 1);
    }
    date = `${date.getDate()}-${date.getMonth()+1}-${date.getYear()+1900}`;
    return date;
}
//Get the district id by the name
const getDistrictId = (districtName)=>{
    return districtId.find(dis=>dis.district_name.toLowerCase() === districtName.toLowerCase()).district_id;

}
//exporting the helper function
module.exports ={
    getTodayDate,
    getDistrictId
}