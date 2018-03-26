const mongoose = require('mongoose');


const messSchema = mongoose.Schema({
	user: mongoose.Schema.Types.ObjectId,
	text: String,
	date: Date,
});

module.exports = mongoose.model('message',messSchema);

module.exports.addMass = (newMess, callback)=>{
	newMess.date = new Date(),
	newMess.save(callback)
}

