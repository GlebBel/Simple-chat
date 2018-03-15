const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
	userName: String,
	password: String,
	created: Date,
})

const User = module.exports = mongoose.model('user',userSchema);

module.exports.createUser = (newUser, callback) => {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			console.log(hash,newUser.password, salt)
			newUser.password = hash;
			newUser.created = new Date();
			newUser.save(callback);
		})
	})
}
module.exports.getUserByUserName = (userName, callback) => {
	User.findOne({userName: userName}, callback);
}

module.exports.getUserById = (id, callback) => {
	User.findById(id, callback);
}

module.exports.comparePasswords = (candidatePassword, hash, callback) => {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) =>{
		if(err) throw err;
		callback(null, isMatch);
	})
}

module.exports.changeUserInfo = (id, field, data, callback) => {
	User.getUserById(id, (err, user) =>{

		if(err) callback(err, null);
		if(user){
			console.log({[field]: data});
			user.set({[field]: data});
			user.save(callback);
		}
	})
}