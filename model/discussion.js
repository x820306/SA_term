var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiscussionSchema = new Schema({
	Content: { type: String },
	ExampleID: { type: Schema.Types.ObjectId, ref: 'Example' },
	CreatedBy: { type: Schema.Types.ObjectId , ref: 'User' },
	CreatedAt: { type: Date, default: Date.now }
});

var Discussion = mongoose.model('Discussion', DiscussionSchema);