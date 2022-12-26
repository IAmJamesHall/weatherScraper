const request = require("request-promise");
const extractWeatherDataFromHTML = require("./modules/extractWeatherDataFromHTML");

const env = require('./env');

//Sequelize requires:
const Sequelize = require("sequelize").Sequelize;
const Model = require("sequelize").Model;
const DataTypes = require("sequelize").DataTypes;

// const url = "https://www.accuweather.com/en/us/endicott/13760/december-weather/1055";
const url =
  "https://weather.com/weather/tenday/l/240f381aa3ed298a691a657f8012d0f226d176e45df5a3fec59c1c342926d3a3"; //ten-day weather forecast from weather.com

// const sequelize = new Sequelize('sqlite::memory:'); // SET UP SEQUELIZE IN-MEMORY DATABASE
// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: './weather.sqlite'
// })

const sequelize = new Sequelize(
  "weather-db", //db name
  env.username, //db username
  env.password, //db pass
  {
    host: "149.28.49.44",
    port: "3306",
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

const Forecast = sequelize.define("Forecast", {
  createdDate: DataTypes.DATE,
  forecastDate: DataTypes.DATE,
  highTemp: DataTypes.INTEGER,
  lowTemp: DataTypes.INTEGER,
  weatherCondition: DataTypes.TEXT,
  precipitationChance: DataTypes.INTEGER
});

const syncTables = async () => {
  try {
    await Forecast.sync(); //use {force:true} to make it drop the table before syncing
  } catch (err) {
    console.log(err);
  }
};

request(url).then(async (html) => {
  console.log("Starting function");
  const weatherArray = extractWeatherDataFromHTML(html);
  await syncTables();
  console.log(weatherArray);

  weatherArray.forEach(async (weatherData) => {
    const data = await Forecast.create({
      createdDate: new Date(weatherData.createdDate),
      forecastDate: new Date(weatherData.forecastDate),
      highTemp: weatherData.highTemp,
      lowTemp: weatherData.lowTemp,
      weatherCondition: weatherData.condition,
      precipitationChance: weatherData.precipitationChance
    });
  });
  const forecasts = await Forecast.findAll();
  // console.log(forecasts);
  sequelize.close();
});
