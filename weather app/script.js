const apiKey = 'YOUR_API_KEY';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weathericon = document.querySelector("weather-icon");

async function checkWeather(city){
    const response = await fetch(apiurl + `${city}&aqi=no`);

    if(response.status == 400){
        document.querySelector(".error").style.display="block";
        document.querySelector(".weather").style.display="none"   
     }
     else{


    var data= await response.json();

    console.log(data);
    console.log("city",data.location.name);
    console.log("temp",data.current.temp_c);
    console.log("Humidity",data.current.humidity);
    console.log("Wind",data.current.wind_kph);
    console.log(data.current.condition.text);

    document.querySelector(".city").innerHTML=data.location.name;
    document.querySelector(".temp").innerHTML=Math.round(data.current.temp_c) +"°C";
    document.querySelector(".humidity").innerHTML=data.current.humidity + "%";
    document.querySelector(".wind").innerHTML=data.current.wind_kph + " km/h";

    document.querySelector(".weather").style.display = "block"

    }
}
searchBtn.addEventListener("click", ()=>{
    checkWeather(searchBox.value)
})
