const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy; 
const jwt = require('jsonwebtoken');
const ExtractJwt = require('passport-jwt').ExtractJwt;
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
	    	console.log(user);
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

const jwtoptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: 'key',
}

passport.use(new JwtStrategy(jwtoptions, (payload, done)=>{
	User.getUserById(payload.id, (err, user) => {
      if (err) {
        return done(err)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
}))

module.exports = passport;