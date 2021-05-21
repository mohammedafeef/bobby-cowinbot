const {districtId} = require('./districtId')
const getTodayDate =()=>{
    let date = new Date();
    date = `${date.getDate()}-${date.getMonth()+1}-${date.getYear()+1900}`
    return date;
}
const getDistrictId = (districtName)=>{
    return districtId.find(dis=>dis.district_name.toLowerCase() === districtName.toLowerCase()).district_id;

}
console.log(getDistrictId('malappuram'));
module.exports ={
    getTodayDate,
    getDistrictId
}