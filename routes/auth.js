const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

////const clientsController = require('../controllers/clientsController');

const router = express.Router();

passport.use(new LocalStrategy(
	function(username, password, done) {
		if(username === "admin" && password === "admin"){
			return done(null, username);
		} else {
			return done("unauthorized access", false);
		}
	}
));

passport.serializeUser(function(user, done) {
	if(user) done(null, user);
});

passport.deserializeUser(function(id, done) {
	done(null, id);
});


const auth = () => {
	return (req, res, next) => {
		passport.authenticate('local', (error, user, info) => {
			if(error) res.status(400).json({"statusCode" : 400 ,"message" : error});
			req.login(user, function(error) {
				if (error) return next(error);
				next();
			});
		})(req, res, next);
	}
}

// api/auth
router.post('/login', auth() , (req, res) => {
	res.status(200).json({"statusCode" : 200 ,"user" : req.user});
});





const isLoggedIn = (req, res, next) => {
	console.log('session ', req.session);
	if(req.isAuthenticated()){
		//console.log('user ', req.session.passport.user)
		return next()
	}
	return res.status(400).json({"statusCode" : 400, "message" : "not authenticated"})
}


//module.exports = router
module.exports = {router: router, isLoggedIn: isLoggedIn}
