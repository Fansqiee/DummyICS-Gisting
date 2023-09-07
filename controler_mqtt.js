const dbase_mqtt = require('./database_config.js');
const mqtt_connect = require('./mqtt_config.js');

require('dotenv').config()

TOPIC_GISTING = process.env.TOPIC;


TS_PATH = process.env.PAYLOAD_GISTING_TS
HUMIDITY280_PATH = process.env.PAYLOAD_GISTING_HUMIDITY_280
PRESSURE280_PATH = process.env.PAYLOAD_GISTING_PRESSURE_280
TEMPERATURE280_PATH = process.env.PAYLOAD_GISTING_TEMPERATURE_280
TEMPERATURE388_PATH = process.env.PAYLOAD_GISTING_TEMPERATURE_388
PRESSURE388_PATH = process.env.PAYLOAD_GISTING_PRESSURE_388
PHSENSOR_PATH = process.env.PAYLOAD_GISTING_PHSENSOR
TDSSENSOR_PATH = process.env.PAYLOAD_GISTING_TDSSENSOR
MOISTURESENSOR_PATH = process.env.PAYLOAD_GISTING_MOISTURESENSOR
ANEMOMETER_PATH = process.env.PAYLOAD_GISTING_ANEMOMETER
WINDVANE_PATH = process.env.PAYLOAD_GISTING_WINDVANE
CURRENTSENSOR_PATH = process.env.PAYLOAD_GISTING_CURRENTSENSOR
RAININTENSITY_PATH = process.env.PAYLOAD_GISTING_RAININTENSITY
RAINSTATUS_PATH = process.env.PAYLOAD_GISTING_RAINSTATUS

var { TS, HUMIDITY280, PRESSURE280, TEMPERATURE280, TEMPERATURE388, PRESSURE388, PHSENSOR, TDSSENSOR, MOISTURESENSOR, ANEMOMETER, WINDVANE, CURRENTSENSOR, RAININTENSITY, RAINSTATUS } = [];

module.exports = {
        // MQTT HANDLING
            async incomingData(topic,message){
            if (topic === TOPIC_GISTING){
                const payload = JSON.parse(message.toString());
        
                // Checking property of Time, Date, and Waterlevel. so it will never null
                if ((payload.hasOwnProperty(TS_PATH))
                    && (payload.hasOwnProperty(HUMIDITY280_PATH))
                    && (payload.hasOwnProperty(PRESSURE280_PATH))
                    && (payload.hasOwnProperty(TEMPERATURE280_PATH))
                    && (payload.hasOwnProperty(TEMPERATURE388_PATH))
                    && (payload.hasOwnProperty(PRESSURE388_PATH))
                    && (payload.hasOwnProperty(PHSENSOR_PATH))
                    && (payload.hasOwnProperty(TDSSENSOR_PATH))
                    && (payload.hasOwnProperty(MOISTURESENSOR_PATH))
                    && (payload.hasOwnProperty(ANEMOMETER_PATH))
                    && (payload.hasOwnProperty(WINDVANE_PATH))
                    && (payload.hasOwnProperty(CURRENTSENSOR_PATH))
                    && (payload.hasOwnProperty(RAININTENSITY_PATH))
                    && (payload.hasOwnProperty(RAINSTATUS_PATH))
                ) {
                    if ((payload[TS_PATH] != null)
                        && (payload[HUMIDITY280_PATH] != null)
                        && (payload[PRESSURE280_PATH] != null)
                        && (payload[TEMPERATURE280_PATH] != null)
                        && (payload[TEMPERATURE388_PATH] != null)
                        && (payload[PRESSURE388_PATH] != null)
                        && (payload[PHSENSOR_PATH] != null)
                        && (payload[TDSSENSOR_PATH] != null)
                        && (payload[MOISTURESENSOR_PATH] != null)
                        && (payload[ANEMOMETER_PATH] != null)
                        && (payload[WINDVANE_PATH] != null)
                        && (payload[CURRENTSENSOR_PATH] != null)
                        && (payload[RAININTENSITY_PATH] != null)
                        && (payload[RAINSTATUS_PATH] != null)
                    ) {
                        // Save Payload to variable
                        TS = payload[TS_PATH];
                        HUMIDITY280 = parseFloat(payload[HUMIDITY280_PATH]);
                        PRESSURE280 = parseFloat(payload[PRESSURE280_PATH]);
                        TEMPERATURE280 = parseFloat(payload[TEMPERATURE280_PATH]);
                        TEMPERATURE388 = parseFloat(payload[TEMPERATURE388_PATH]);
                        PRESSURE388 = parseFloat(payload[PRESSURE388_PATH]);
                        PHSENSOR = parseFloat(payload[PHSENSOR_PATH]);
                        TDSSENSOR = parseFloat(payload[TDSSENSOR_PATH]);
                        MOISTURESENSOR = parseFloat(payload[MOISTURESENSOR_PATH]);
                        ANEMOMETER = parseFloat(payload[ANEMOMETER_PATH]);
                        WINDVANE = parseFloat(payload[WINDVANE_PATH]);
                        CURRENTSENSOR = parseFloat(payload[CURRENTSENSOR_PATH]);
                        RAININTENSITY = parseFloat(payload[RAININTENSITY_PATH]);
                        RAINSTATUS = parseFloat(payload[RAINSTATUS_PATH]);
                    }
        
                }
                const dataArray = [TS, HUMIDITY280, PRESSURE280, TEMPERATURE280, TEMPERATURE388, PRESSURE388, PHSENSOR, TDSSENSOR, MOISTURESENSOR, ANEMOMETER, WINDVANE, CURRENTSENSOR, RAININTENSITY, RAINSTATUS];
                const insertQuery = `INSERT INTO sensor_data (datetime, humidity_280, pressure_280, temperature_280, temperature_388, pressure_388, phsensor, tdsSensor, moistureSensor, anemoMeter, windVane, currentSensor, rainIntensity, rainStatus) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;
                dbase_mqtt.query(insertQuery, dataArray, (err, res) => {
                    if (err) throw err;
                 console.log(`DATA INSERTED TO DATABASE: Time - ${TS}, HMDTY 280 - ${HUMIDITY280}, PRSS 280 - ${PRESSURE280}, TEMP 280 - ${TEMPERATURE280}, TEMP 388 - ${TEMPERATURE388}, PRSS 388 - ${PRESSURE388}, PH - ${PHSENSOR}, TDS - ${TDSSENSOR}, MOIS - ${MOISTURESENSOR}, AMeter - ${ANEMOMETER}, WVane - ${WINDVANE}, CRNT - ${CURRENTSENSOR}, RIntensity - ${RAININTENSITY}, RStatus - ${RAINSTATUS}`);
                });
            }
        }
}