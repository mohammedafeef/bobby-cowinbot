const axios = require('axios').default;
//setting axios common properties all request
axios.defaults.baseURL = 'https://cdn-api.co-vin.in/api'
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0'
//importing the helper to get date and district id
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
        const dist = getDistrictId(districtname);
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

        console.log("P-W\n",err);
    }
};

//To get vaccination session by district for 7 days
const getSessionByDistrictForWeek= async (districtName)=>{
    try {
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

        console.log("D-W\n",err);
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

//exporting all of the api request generators
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


