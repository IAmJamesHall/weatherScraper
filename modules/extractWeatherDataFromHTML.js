const cheerio = require('cheerio');



const extractWeatherDataFromHTML = (html) => {
    const weatherArray = [];
    const $ = cheerio.load(html);
    for (let i = 1; i < 15; i += 1) {
        const weatherDetail = $(`details#detailIndex${i}`).html();
        
        //TODO: figure out how to put the info inside an object, and organize by date
        const forecastDate = extractDate(weatherDetail);
        const temps = extractTemps(weatherDetail);
        const condition = extractCondition(weatherDetail);
        const precipitationChance = extractPrecipitationChance(weatherDetail);
        const d = new Date();

        weatherArray.push({ 
            createdDate: `${d.getFullYear()}/${d.getMonth()}/${d.getDate()}`,
            forecastDate, 
            highTemp: temps.highTemp, 
            lowTemp: temps.lowTemp,
            condition,
            precipitationChance
        });

        
    }
    console.log(weatherArray);

}

const extractDate = (weatherDetail) => {
    const $ = cheerio.load(weatherDetail);
    const day = Number($('h3', weatherDetail).text().slice(4, 6)); // day of the month (e.g. 14)

    let dateString;
    //get current day of the month
    const d = new Date;

    

    const thisMonth = d.getMonth() + 1; //add 1 to the current month number (Date() is zero-based)
    let nextMonth = d.getMonth() + 2;  //add 2 to the month number (zero-based)

    let year = d.getFullYear()

    if (nextMonth == 13) { //handling December/January nonsense
        nextMonth = 1;
        year += 1;
    }


    if (d.getDate() < day) {
        dateString = `${year}/${thisMonth}/${day}` 
    } else if (d.getDate() > day) {
        dateString = `${year}/${nextMonth}/${day}`
    }

    return dateString;
}

const extractTemps = (weatherData) => {
    const $ = cheerio.load(weatherData);
    let temps = $("div[data-testid='detailsTemperature']").text();
    const highTemp = temps.match(/([0-9]+)°\//)[1];
    const lowTemp = temps.match(/\/([0-9]+)°/)[1];

    return({ highTemp, lowTemp });
}

const extractCondition = (weatherData) => {
    const $ = cheerio.load(weatherData);
    return $('.DetailsSummary--condition--2JmHb span').text();
}

const extractPrecipitationChance = (weatherData) => {
    const $ = cheerio.load(weatherData);
    return $('.DetailsSummary--precip--1a98O span').text();
}


module.exports = extractWeatherDataFromHTML;