const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
		usernameField: 'userName',
  		passwordField: 'password'
	},
	function(username, password, done) {
	    User.getUserByUserName(username, function(err, user){
	   	    if(err) throw err;
	   	    if(!user){
	   		    return done(null, false, {message: 'Unknown User'});
	   		}

		   	User.comparePasswords(password, user.password, function(err, isMatch){
		   		if(err) throw err;
		   		if(isMatch){
		   			return done(null, user);
		   		} else {
		   			return done(null, false, {message: 'Invalid password'});
		   		}
   			});
    	});
 	})
);

module.exports = passport;