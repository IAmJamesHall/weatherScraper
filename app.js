const rp = require('request-promise');
const extractWeatherDataFromHTML = require('./extractWeatherDataFromHTML');
// const puppeteer = require('puppeteer');
// const url = "https://www.accuweather.com/en/us/endicott/13760/december-weather/1055";
const url = "https://weather.com/weather/tenday/l/240f381aa3ed298a691a657f8012d0f226d176e45df5a3fec59c1c342926d3a3"; //tenday weather forecast from weather.com

console.log('Starting function');
rp(url)
    .then(html => {
        console.log('Success');
        extractWeatherDataFromHTML(html);
    });

