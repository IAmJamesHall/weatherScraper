const request = require('request-promise');
const extractWeatherDataFromHTML = require('./modules/extractWeatherDataFromHTML');

//Sequelize requires:
const Sequelize = require('sequelize').Sequelize;
const Model = require('sequelize').Model;
const DataTypes = require('sequelize').DataTypes;


// const url = "https://www.accuweather.com/en/us/endicott/13760/december-weather/1055";
const url = "https://weather.com/weather/tenday/l/240f381aa3ed298a691a657f8012d0f226d176e45df5a3fec59c1c342926d3a3"; //ten-day weather forecast from weather.com



// const sequelize = new Sequelize('sqlite::memory:'); // SET UP SEQUELIZE IN-MEMORY DATABASE
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './weather.sqlite'
})

const Forecast = sequelize.define('Forecast', {
    createdDate: DataTypes.DATE,
    forecastDate: DataTypes.DATE,
    highTemp: DataTypes.NUMBER,
    lowTemp: DataTypes.NUMBER,
    condition: DataTypes.STRING
})

const syncTables = async () => {
    await Forecast.sync(); //use {force:true} to make it drop the table before syncing
}

request(url)
    .then(async (html) => {
        console.log('Starting function');
        const weatherArray = extractWeatherDataFromHTML(html);
        await syncTables();
        console.log(weatherArray);

        weatherArray.forEach(async (weatherData) => {
            const data = await Forecast.create({
                createdDate: new Date(weatherData.createdDate),
                forecastDate: new Date(weatherData.forecastDate),
                highTemp: weatherData.highTemp,
                lowTemp: weatherData.lowTemp,
                condition: weatherData.condition
            })
        })
        const forecasts = await Forecast.findAll();
        // console.log(forecasts);
        sequelize.close();
    });