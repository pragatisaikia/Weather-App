const notifyElement = document.querySelector(".notify");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature p");
const descElement = document.querySelector(".temp-desc p");
const locationElement = document.querySelector(".location p");

const weather = {};
const key = "4943d1a31d77050417bfb053cc0176fa";

weather.temperature = {
    unit : "celsius"
}

const KELVIN = 273;


if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notifyElement.style.display = "block";
    notifyElement.innerHTML = "<p>Browser doesn't support Geolocation</p>"
}

function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude,longitude);
}

function showError(error){
    notifyElement.style.display = "block";
    notifyElement.innerHTML = `<p>${error.message}</p>`
}

function getWeather(latitude,longitude) {
    let api = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        })
}

function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`
    tempElement.innerHTML = `${weather.temperature.value} degree<span> C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city},${weather.country}`;
}

function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

tempElement.addEventListener("click",function(){
    if(weather.temperature.value === undefined) return;
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        tempElement.innerHTML = `${fahrenheit} degree <span> F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value} degree <span> C</span>`;
        weather.temperature.value = "celsius";
    }
})
