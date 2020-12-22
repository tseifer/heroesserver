const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');
require('dotenv').config()
const FacebookStrategy = require('passport-facebook').Strategy;
const configAuth       = require('../config/oath');


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

passport.use(new FacebookStrategy({
	
	                                  // pull in our app id and secret from our auth.js file
	                                  clientID        : configAuth.facebookAuth.clientID,
	                                  clientSecret    : configAuth.facebookAuth.clientSecret,
	                                  callbackURL     : configAuth.facebookAuth.callbackURL
	
                                  },
                                  // facebook will send back the token and profile
                                  function(token, refreshToken, profile, done) {
	                                  // asynchronous
	                                  process.nextTick(function() {
		
		                                  // find the user in the database based on their facebook id
		                                  User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
			
			                                  // if there is an error, stop everything and return that
			                                  // ie an error connecting to the database
			                                  if (err)
				                                  return done(err);
			
			                                  // if the user is found, then log them in
			                                  if (user) {
				                                  return done(null, user); // user found, return that user
			                                  } else {
				                                  // if there is no user found with that facebook id, create them
				                                  var newUser            = new User();
				
				                                  // set all of the facebook information in our user model
				                                  newUser.facebook.id    = profile.id; // set the users facebook id
				                                  newUser.facebook.token = token; // we will save the token that facebook provides to the user
				                                  newUser.facebook.name  = profile.displayName; // look at the passport user profile to see how names are returned
				                                  newUser.email = profile.displayName //emails[0].value;
				                                  newUser.firstName = profile.displayName ;
				                                  console.log("profile.email: " + profile.email)
				                                  
				                                  // save our user to the database
				                                  newUser.save(function(err) {
					                                  if (err)
						                                  throw err;
					
					                                  // if successful, return the new user
					                                  return done(null, newUser);
				                                  });
			                                  }
			
		                                  });
	                                  });
	
                                  }));

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


// api/auth/login
router.post('/signup' , (req, res) => {
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

// Facebook auth routes
//api/auth/facebook
router.get('/facebook', function authenticateFacebook (req, res, next) {
	        req.session.returnTo = '/dashboard';  //'/#' + req.query.returnTo;
	        next();
        },
        passport.authenticate ('facebook')
); //use facebook strategy

//api/auth/facebook_callback
router.get('/facebook_callback', function (req, res, next) {
	var authenticator = passport.authenticate ('facebook', {
		successRedirect: req.session.returnTo,
		failureRedirect: '/'
	});
	
	delete req.session.returnTo;
	authenticator(req, res, next);
})


//module.exports = router
module.exports = {router: router, isLoggedIn: isLoggedIn}
