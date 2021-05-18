const axios = require('axios');

//setting default header for all api request
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0';
//api base url
axios.defaults.baseURL = 'https://cdn-api.co-vin.in/api';

//to get the data by pin
const getDataByDistrictId = async (districtId = 304,date = '06-05-2021')=>{
    try {
        const res = await axios.get('/v2/appointment/sessions/public/calendarByDistrict',
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
          },
          //parameters in the route
          params: {
              'district_id':`${districtId}`,
              'date':`${date}`
          }
        });
        //sending back the res 
        return res.data.centers;
        // // console.log(res);
        // let data = res.data.centers;
        // data.forEach((loc)=>console.log(loc.sessions.available_capacity_dose1?"slots available":"slots not available"));

    } catch (err){

        console.log(err);
    }
};
getDataByDistrictId(302,"17-05-2021");
module.exports = {
    getDataByDistrictId
};
