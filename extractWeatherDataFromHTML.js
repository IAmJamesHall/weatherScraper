const cheerio = require('cheerio');



const extractWeatherDataFromHTML = (html) => {
    const weatherData = {};
    const $ = cheerio.load(html);
    for (let i = 1; i < 15; i += 1) {
        const weatherDetail = $(`details#detailIndex${i}`);
        
        //TODO: figure out how to put the info inside an object, and organize by date
        const date = extractDate(weatherDetail);
        extractTemps(weatherDetail);
    }
    // console.log($('details#detailIndex1').text());
}

const extractDate = (weatherDetail) => {
    const $ = cheerio.load(weatherDetail.html());
    const day = Number($('h3', weatherDetail).text().slice(4, 6)); // day of the month (e.g. 14)

    let dateString;
    //get current day of the month
    const d = new Date;

    const thisMonth = d.getMonth() + 1; //add 1 to the current month number (Date() is zero-based)
    let nextMonth = d.getMonth() + 2;  //add 2 to the month number (zero-based)
    if (nextMonth == 13) nextMonth = 1;
    if (d.getDate() < day) {
        dateString = `${thisMonth}/${day}` 
    } else if (d.getDate() > day) {
        dateString = `${nextMonth}/${day}`
    }

    return dateString;
}

const extractTemps = (weatherData) => {
    const $ = cheerio.load(weatherData.html());
    let temps = $("div[data-testid='detailsTemperature']").text();
    const highTemp = temps.match(/([0-9]+)°\//)[1];
    const lowTemp = temps.match(/\/([0-9]+)°/)[1];

    return({ highTemp, lowTemp });
}


module.exports = extractWeatherDataFromHTML;