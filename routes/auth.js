const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');

////const clientsController = require('../controllers/clientsController');

const router = express.Router();

passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log("checking username: " + username)
		User.findOne(
			{
				email: username.toLowerCase()
			}, function(err, user) {
			// if there are any errors, return the error before anything else
			if (err)
			{
				console.log('ERROR: ' + JSON.stringify(err))
				return done(err, false);
			}
			
			// if no user is found, return the message
			if (!user)
			{
				console.log('ERROR: no user found')
				return done('unauthorized access', false);
			}
			
			// if the user is found but the password is wrong
			if (user.validatePassword(password).then((isValid) => {
				console.log("Response of validatePassword: " + isValid)
				if (!isValid)
				{
					return done('unauthorized access: password problem', false);
				} else {
					// all is well, return successful user
					return done(null, user);
				}
			}));
			
		});
		
		
		// if(username === "admin" && password === "admin"){
		// 	return done(null, username);
		// } else {
		// 	return done("unauthorized access", false);
		// }
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
		console.log("Authenticating... (username and password)")
		passport.authenticate('local', (error, user, info) => {
			if(error) res.status(400).json({"statusCode" : 400 ,"message" : error});
			req.login(user, function(error) {
				if (error) return next(error);
				next();
			});
		})(req, res, next);
	}
}

// api/auth/login
router.post('/login', auth() , (req, res) => {
	res.status(200).json({"statusCode" : 200 ,"user" : req.user});
});

const  signup = () => {
	return  (req, res, next) => {
		User.findOne({
			             email: req.body.username.toLowerCase()
		             }, async function(err, user) {
			if (user) {
				res.status(400).json({"statusCode" : 400 ,"message" : "User already exists"});
				return;
			} else {
				var newUser = new User();
				newUser.email = req.body.username.toLowerCase();
				newUser.password = await newUser.generateHash(req.body.password);
				newUser.save(function(err, user) {
					if (err) {
						console.log("error: " + JSON.stringify(err));
						res.status(400).json({"statusCode" : 400 ,"message" : "Can't create user"});
						return;
					}
					res.status(200).json({"statusCode" : 200 ,"message" : "User created"});
				});
			}
		});
	}
}


// api/auth/login
router.post('/signup', signup() , (req, res) => {
	res.status(200).json({"statusCode" : 200 });
});



const isLoggedIn = (req, res, next) => {
	console.log('session ', req.session);
	if(req.isAuthenticated()){
		//console.log('user ', req.session.passport.user)
		return next()
	}
	return res.status(400).json({"statusCode" : 400, "message" : "not authenticated"})
}

// api/auth/logout
router.get('/logout', (req, res) => {
	console.log('performing logout')
	req.logout();
	res.status(200).json({"statusCode" : 200 });
});

//module.exports = router
module.exports = {router: router, isLoggedIn: isLoggedIn}
