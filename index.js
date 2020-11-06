const express = require('express');
//const path = require('path');
const logger = require('./logger')
const uuid = require('uuid');
const bodyParser = require('body-parser');
const heroes = require('./heroes');
const clients = require('./clients');
//const cors = require('cors');

let app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

app.use(logger);

app.use('/api/heroes', heroes);
app.use('/api/clients', clients);






const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
	console.log('server is up on port ' + PORT);
})





