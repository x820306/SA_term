var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApiSchema = new Schema({
	Language: { type: String },
	Introduction: { type: String },
	FunctionName: { type: String },
	Parameter: { type: String },
	ReturnValue: { type: String },
	SeeAlso: { type: String },
	Compatibility: { type: String },
	NeedNumber: { type: Number, default: 0 },
	Needs: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	Examples: [{ type: Schema.Types.ObjectId, ref: 'Example' }]
});

var Api = mongoose.model('Api', ApiSchema);