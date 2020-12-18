const express = require('express');
const path = require('path');
const logger = require('./logger')
const uuid = require('uuid');
const bodyParser = require('body-parser');
const heroes = require('./routes/heroes');
const clients = require('./routes/clients');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');


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
app.use(session({ secret: 'anything', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

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

const isLoggedIn = (req, res, next) => {
	console.log('session ', req.session);
	if(req.isAuthenticated()){
		//console.log('user ', req.session.passport.user)
		return next()
	}
	return res.status(400).json({"statusCode" : 400, "message" : "not authenticated"})
}


app.use('/api/heroes', isLoggedIn, heroes);
app.use('/api/clients', isLoggedIn, clients);
app.use('/api/auth', auth);


app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/*', async (req, res) => {
	//res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
	res.redirect('/');
});








const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
	console.log('server is up on port ' + PORT);
})





