const axios = require('axios').default;

axios.defaults.baseURL = 'https://cdn-api.co-vin.in/api'
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0'

//To get list of states

function getStates(){
    axios.get('/v2/admin/location/states')
    .then(response =>{
        console.log(response.data.states)
    })
    .catch(error =>{
        console.log(error)
    })
}


//To get list of districts

function getDistricts(){
    axios.get('/v2/admin/location/districts/17')
    .then(response =>{
        console.log(response.data)
    })
    .catch(error =>{
        console.log(error)
    })
}

//To get vaccination sessions by pincode

function getSessionByPin(){
    axios.get('/v2/appointment/sessions/public/findByPin', {params:{pincode : 110001 , date : 17-05-2021}})
    .then(response =>{
        console.log(response.data)
    })
    .catch(error =>{
        console.log(error)
    })
}

//To get vaccination sessions by district

function getSessionByDistrict(){
    axios.get('/v2/appointment/sessions/public/findByDistrict', {params:{district_id : 512 , date : 17-05-2021}})
    .then(response =>{
        console.log(response.data)
    })
    .catch(error =>{
        console.log(error)
    })
}

//To get vaccination centers by latitude and longitude

function getCentersByLatlong(){
    axios.get('/v2/appointment/centers/public/findByLatLong', {params:{lat : 28.72 , long : 77.14}})
    .then(response =>{
        console.log(response.data)
    })
    .catch(error =>{
        console.log(error)
    })
}

//To get vaccination session by pincode for 7 days

function getSessionsByPin7(){
    axios.get('/v2/appointment/sessions/public/calendarByPin', {params:{pincode : 110001 , date : 17-05-2021}})
    .then(response =>{
        console.log(response.data)
    })
    .catch(error =>{
        console.log(error)
    })
}

//To get vaccination session by district for 7 days

function getSessionsByDistrict7(){
    axios.get('/v2/appointment/sessions/public/calendarByDistrict', {params:{district_id : 512 , date : 17-05-2021}})
    .then(response =>{
        console.log(response.data)
    })
    .catch(error =>{
        console.log(error)
    })
}

//To get vaccination session by center for 7 days

function getSessionsBycenter7(){
    axios.get('/v2/appointment/sessions/public/calendarByCenter', {params:{center_id : 1254 , date : 17-05-2021}})
    .then(response =>{
        console.log(response.data)
    })
    .catch(error =>{
        console.log(error)
    })
}