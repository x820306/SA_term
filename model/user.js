var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	Identifier: { type: String, required: true },
	DisplayName: { type: String, required: true },
	LoginBy: String,
	Created: { type: Date, default: Date.now }
});

var User = mongoose.model('User', UserSchema);