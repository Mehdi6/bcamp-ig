mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	content: String,
	post_id: String,
	created_at: Date
	});

mongoose.model('Comments', CommentSchema);