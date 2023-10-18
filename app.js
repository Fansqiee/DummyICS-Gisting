"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const https = require('https');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/vps.isi-net.org/privkey.pem','utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/vps.isi-net.org/cert.pem','utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/vps.isi-net.org/chain.pem','utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
  ca: ca
};

const api = express();
api.use(bodyParser.urlencoded({ extended: false }))
api.use(bodyParser.json())
api.use(cors({
    origin:['http://localhost/8080','*']
}));


const dbase_gisting = require('./database_config.js'); 
dbase_gisting.query(`create table if not exists sensor_data (
  datetime timestamp not null, 
  humidity_280 float, 
  pressure_280 float, 
  temperature_280 float, 
  temperature_388 float, 
  pressure_388 float, 
  phsensor float, 
  tdsSensor float, 
  moistureSensor float, 
  anemoMeter float, 
  windVane float, 
  currentSensor float, 
  rainIntensity float, 
  rainStatus float
 )
  `, function(err, result){
    console.log("Database Gisting Connected");
  });


// API HANLDING
const gisting_appRoute = require('./route.js');
api.use('/', cors(), gisting_appRoute);

api.use('/', cors(), (req, res) => {
    res.status(404);
    res.send('API SUDAH ONLINE | GISTING BACKEND '); // respond 404 if not available
});  

// Starting both http & https servers
//const httpServer = http.createServer(api);
const httpsServer = https.createServer(credentials, api);
//const httpsServer = https.createServer(credentials, api);

httpsServer.listen(process.env.API_PORT, () => {
	console.log(`HTTP REST-API running on port ${process.env.API_PORT}`);
});



//httpsServer.listen(4443, () => {
	//console.log('HTTPS REST-API running on port 4443');
//});

const topic = process.env.TOPIC;
const mqtt_connect = require('./mqtt_config.js')
const {incomingData} = require('./controler_mqtt.js') 
  // Subscribe topic to receive data from raspberryPi
  // Data From Gisting
//Subscribe topic to receive API request
mqtt_connect.subscribe(topic, (err) => {
  if (!err) {
    console.log("Subscribed to topic : " + topic); 
  } else throw (err);
});

// Handle message from mqtt
mqtt_connect.on("message", incomingData);