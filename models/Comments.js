mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	content: String,
	post_id: String,
	parent_comment_id: String,
	created_at: Date,
	reactions: Array
	});

mongoose.model('Comments', CommentSchema);