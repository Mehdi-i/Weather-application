const currentLocation = document.querySelector('.current-location');
const APIkey = /* Obtain a key from WeatherAPI.com*/;
const cityImage = document.querySelector('.city');
const forecastIcon = document.querySelector('.weather-icon');
const weatherDegree = document.querySelector('.degree');
const date = document.querySelector('.date');
const state = document.querySelector('.status');
const precipitation = document.querySelector('.precipitation');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const sun = document.querySelector('.sun');
const moon = document.querySelector('.moon');
const max = document.querySelectorAll('.max');
const min = document.querySelectorAll('.min');
const day = document.querySelectorAll('.day-number');
const happenings = document.querySelectorAll('.day-state');
const forecastDayIcon = document.querySelectorAll('.icon');
const elements = [
    currentLocation,
    weatherDegree,
    date,
    state,
    precipitation,
    humidity,
    wind,
    sun,
    moon,
    ...max,
    ...min,
    ...day,
    ...happenings,
];

let latitude, longitude;
let APIurl;

const init = function () {
    elements.forEach((el) => {
        if (el) el.textContent = '--';
    });
};

init();
getLocation();

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        currentLocation.innerHTML =
            'Geolocation is not supported by this browser.';
    }
}
function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

function getWeather(coordsX, coordsY) {
    const APIurl = `http://api.weatherapi.com/v1/forecast.json?key=${APIkey}&days=3&aqi=yes&q=${coordsX},${coordsY}&`;

    fetch(APIurl)
        .then((result) => result.json())
        .then((data) => {
            console.log('Weather data:', data);
            currentLocation.textContent = `${data.location.name}, ${data.location.region} ${data.location.country}`;
            forecastIcon.src = data.current.condition.icon;
            weatherDegree.textContent = data.current.temp_c + '°';
            wind.textContent = data.current.wind_kph + ' km/h';
            precipitation.textContent = data.current.precip_mm + ' mm';
            humidity.textContent = data.current.humidity + '%';
            sun.textContent = data.forecast.forecastday[0].astro.sunrise;
            moon.textContent = data.forecast.forecastday[0].astro.sunset;
            date.textContent = data.location.localtime;
            state.textContent = data.current.condition.text;

            data.forecast.forecastday.forEach((dayData, i) => {
                if (min[i]) min[i].textContent = dayData.day.mintemp_c + '°';
                if (max[i]) max[i].textContent = dayData.day.maxtemp_c + '°';

                if (day[i]) day[i].textContent = dayData.date;
                if (happenings[i])
                    happenings[i].textContent = dayData.day.condition.text;

                if (forecastDayIcon[i])
                    forecastDayIcon[i].src = dayData.day.condition.icon;
            });
        })
        .catch((err) => console.error('Fetch error:', err));
}
