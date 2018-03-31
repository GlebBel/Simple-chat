const mongoose = require('mongoose');


const messSchema = mongoose.Schema({
	user: mongoose.Schema.Types.ObjectId,
	text: String,
	date: Date,
});

const Mass = module.exports = mongoose.model('message', messSchema);

module.exports.addMess = (newMess, callback) => {
	newMess.date = new Date(),
	newMess.save(callback)
}
module.exports.getMessList = (callback) => {
	Mass.find({}, callback);
}

