const axios = require('axios').default;

axios.defaults.baseURL = 'https://cdn-api.co-vin.in/api'
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0'

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
const getDistricts = async ()=>{
    try {
        const res = await axios.get('/v2/admin/location/districts/17');
        //sending back the res data
        return(res.data);

    } catch (err){

        console.log(err);
    }
};

//To get vaccination sessions by pincode
const getSessionByPin = async (pincode = 110001,date = '16-05-2021')=>{
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
const getSessionByDistrict = async (districtid = 304,date = '16-05-2021')=>{
    try {
        const res = await axios.get('/v2/appointment/sessions/public/findByDistrict',
        {
         params: {
              'district_id':`${districtid}`,
              'date':`${date}`
          }
        });
        //sending back the res data
        return(res.data);

    } catch (err){

        console.log(err);
    }
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
const getSessionByPin7 = async (pincode = 110001,date = '16-05-2021')=>{
    try {
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
const getSessionByDistrict7 = async (districtid = 305,date = '16-05-2021')=>{
    try {
        const res = await axios.get('/v2/appointment/sessions/public/calendarByDistrict',
        {
         params: {
              'district_id':`${districtid}`,
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
const getSessionByCentre7 = async (centerid = 1235,date = '16-05-2021')=>{
    try {
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

getSessionByCentre7(8785,'18-05-2021')
.then(data=>console.log(data))