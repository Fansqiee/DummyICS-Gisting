const router = require('express').Router();
const gisting_http = require('./controler_http.js');

router.get('/getDataGisting', gisting_http.getDataGisting);// route request to respond lastest 100 data

module.exports = router;