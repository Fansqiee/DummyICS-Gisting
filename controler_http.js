
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

    },

    async getDataGistingNew(req, res) {
        const data = await dbase_rest.query(`SELECT datetime, humidity_280, pressure_280, temperature_280, temperature_388, pressure_388, phsensor, tdsSensor, moistureSensor, anemoMeter, windVane, currentSensor, rainIntensity, rainStatus 
            FROM sensor_data ORDER BY datetime DESC LIMIT 100`);
    
        if (data.rowCount > 0) {
            const combinedArray = data.rows.map(row => {
                const { datetime, ...rest } = row;
                return {
                    datetime: moment(datetime).format("DD-MM-YY HH:mm:ss"),
                    ...rest,
                };
            });
    
            res.status(200);
            res.send({
                count: data.rowCount,
                result: combinedArray,
            });
    
            console.log("[REST-API] GET DATA 100");
        } else {
            res.status(404).send("No data found");
        }
    }
    
}
