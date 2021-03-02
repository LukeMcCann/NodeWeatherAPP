'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const { json } = require('express');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
    const query = req.body.cityName;
    const units = req.body.measurement;

    const currentWeatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=${units}`;
    
    https.get(currentWeatherEndpoint, function (response) {
        response.on('data', function (data) {
            const currentWeatherData = JSON.parse(data);
            const temp = currentWeatherData.main.temp;
            const description = currentWeatherData.weather[0].description;
            const icon = currentWeatherData.weather[0].icon;
            const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            
            let suffix = '';
            if (units === 'metric') {
                suffix = 'celsius';
            } 

            if (units === 'imperial') {
                suffix = 'farenheit';
            }

            if (units === 'kelvin') {
                suffix = 'kelvin';
            }

            res.set('Content-Type', 'text/html');
            res.write('<h3>The weather is currently: ' + description + '</h3>');
            res.write('<h1>The temperature in' + query + ' is ' + temp + ` ${suffix}` + '. </h3>');
            res.write("<img src=" + imageURL + ">");
            res.send();
        });
    });
});

app.listen(3000, function () {
    console.log('Listening on port: 3000');
});