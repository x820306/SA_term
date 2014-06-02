var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExampleSchema = new Schema({
	Description: { type: String },
	Code: { type: String },
	Output: { type: String },
	CreatedAt: { type: Date, default: Date.now },
	UpdatedAt: { type: Date, default: Date.now },
	LikeNumber: { type: Number, default: 0 },
	CreatedBy: { type: Schema.Types.ObjectId , ref: 'User' },
	Likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	Discussions: [{ type: Schema.Types.ObjectId, ref: 'Discussion' }],
	ApiID: { type: Schema.Types.ObjectId, ref: 'Api' }
});

var Example = mongoose.model('Example', ExampleSchema);