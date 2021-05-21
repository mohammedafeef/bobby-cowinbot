const axios = require('axios').default;

axios.defaults.baseURL = 'https://cdn-api.co-vin.in/api'
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0'

const {districtId} = require('./districtId');

const {getTodayDate,getDistrictId} = require('./apiHelper');
//To get list of states
const getStates = async ()=>{
    try {
        const res = await axios.get('/v2/admin/location/states');
        //sending back the res data
        return(res.data);
    } catch (err){
        console.log(err);
    }
};


//To get list of districts
const getDistricts = async (stateid=17)=>{
    try {
        const res = await axios.get(`/v2/admin/location/districts/${stateid}`);
        //sending back the res data
        return(res.data);
    } catch (err){
        console.log(err);
    }
};

//To get vaccination sessions by pincode
const getSessionByPin = async (pincode = 110001)=>{
    const date = getTodayDate();
    try {
        const res = await axios.get('/v2/appointment/sessions/public/findByPin',
        {
          //parameters in the route                                     
          params: {
              'pincode':`${pincode}`,
              'date':`${date}`
          }
        });
        //sending back the res data
        return(res.data);

    } catch (err){

        console.log(err);
    }
};

//To get vaccination sessions by district
const getSessionByDistrict = async (districtname)=>{
    try {
        const date = getTodayDate();
        console.log(date);
        const dist = districtId.find(dis=>dis.district_name.toLowerCase() === districtname.toLowerCase());
        const res = await axios.get(
        '/v2/appointment/sessions/public/findByDistrict',
        {
         params: {
              'district_id':`${dist.district_id}`,
              'date':`${date}`
          }
        });
        //sending back the res data
        return(res.data);

    } catch (err){console.log(err)}
};
// getSessionByDistrict(302,'18-5-2021').then((data)=>console.log(data));
// getDistricts().then((data)=>console.log(data));
//To get vaccination centers by latitude and longitude
const getCentersByLat = async (lat=28.72,long=77.14)=>{
    try {
        const res = await axios.get('/v2/appointment/centers/public/findByLatLong',
        {
         params: {
              'lat':`${lat}`,
              'long':`${long}`
          }
        });
        //sending back the res data
        return(res.data);

    } catch (err){

        console.log(err);
    }
};

//To get vaccination session by pincode for 7 days
const getSessionByPinForWeek = async (pincode = 110001)=>{
    try {
        console.log(pincode);
        const date = getTodayDate();
        const res = await axios.get('/v2/appointment/sessions/public/calendarByPin',
        {                                  
          params: {
              'pincode':`${pincode}`,
              'date':`${date}`
          }
        });
        //sending back the res data
        return(res.data);

    } catch (err){

        console.log(err);
    }
};

//To get vaccination session by district for 7 days
const getSessionByDistrictForWeek= async (districtName)=>{
    try {
        console.log("hai i am here")
        const date = getTodayDate();
        const res = await axios.get('/v2/appointment/sessions/public/calendarByDistrict',
        {
         params: {
              'district_id':`${getDistrictId(districtName)}`,
              'date':`${date}`
          }
        });
        //sending back the res data
        return(res.data);

    } catch (err){

        console.log(err);
    }
};

//To get vaccination session by center for 7 days
const getSessionByCentreForWeek = async (centerid = 1235)=>{
    try {
        const date = getTodayDate();
        const res = await axios.get('/v2/appointment/sessions/public/calendarByCenter',
        {
         params: {
              'center_id':`${centerid}`,
              'date':`${date}`
          }
        });
        //sending back the res data
        return(res.data);

    } catch (err){

        console.log(err);
    }
};
// getSessionByDistrict('malappuram').then((data)=>console.log(data));
// getSessionByDistrict('malappuram').then((data)=>console.log(data));
module.exports = {
    getStates, 
    getDistricts, 
    getSessionByPin, 
    getSessionByDistrict, 
    getCentersByLat, 
    getSessionByPinForWeek, 
    getSessionByDistrictForWeek, 
    getSessionByCentreForWeek
}

// module.exports.getStates = getStates;
// module.exports.getDistricts = getDistricts;
// module.exports.getSessionByPin = getSessionByPin;
// module.exports.getSessionByDistrict = getSessionByDistrict;
// module.exports.getCentersByLat = getCentersByLat;
// module.exports.getSessionByPin7 = getSessionByPin7;
// module.exports.getSessionByDistrict7 = getSessionByDistrict7;
// module.exports.getSessionByCentre7 = getSessionByCentre7;


//getDistricts(16)
//.then(data=>console.log(data))
