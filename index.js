const express = require('express');
const path = require('path');
const logger = require('./logger')
const uuid = require('uuid');
const bodyParser = require('body-parser');
const heroes = require('./routes/heroes');
const clients = require('./routes/clients');
const mongoose = require('mongoose');

//const cors = require('cors');
const expressSanitizer = require('express-sanitizer');

const dbUri = 'mongodb+srv://tidhar:123tidhar456@cluster0.v9bxr.mongodb.net/myapp1?retryWrites=true&w=majority';
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
	console.log('connected to DB')
});

let app = express()
app.use(expressSanitizer());

app.use('/*', ((req, res, next) => {
	console.log('kuku ' + JSON.stringify(req.params));
	next()
}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

app.use(logger);

app.use('/api/heroes', heroes);
app.use('/api/clients', clients);



app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/*', async (req, res) => {
	//res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
	res.redirect('/');
});








const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
	console.log('server is up on port ' + PORT);
})





