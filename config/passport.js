const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy; 
const jwt = require('jsonwebtoken');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user.js');

const jwtoptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: 'key',
}

passport.use(new JwtStrategy(jwtoptions, (payload, done)=>{
	console.log(payload)
	User.getUserById(payload._id, (err, user) => {
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