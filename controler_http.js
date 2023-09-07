
const path = require('path');
const moment = require('moment');
const {Pool} = require('pg')
const { off } = require('process');
const { start } = require('repl');
require('dotenv').config()
require('fs');
const dbase_rest= new Pool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_GISTING
})
dbase_rest.connect();
module.exports = {

    // HTTP HANDLING

    // Respond request to give latest 100 data
    async getDataGisting(req, res) {
        data = await dbase_rest.query(`SELECT datetime, humidity_280, pressure_280, temperature_280, temperature_388, pressure_388, phsensor, tdsSensor, moistureSensor, anemoMeter, windVane, currentSensor, rainIntensity, rainStatus 
        FROM sensor_data ORDER BY datetime DESC LIMIT 100`);

        res.status(200);
        res.send({
            count:data.rowCount,
            result:data.rows.reverse(),
        })
        console.log("[ REST-API ] GET DATA 100");

    }
}
