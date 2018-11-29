mongoose = require("mongoose");
const Schema = mongoose.Schema;

Reactions = Schema({
	postId: mongoose.Types.ObjectId,
	type: String,
	created_at: Date
});

mongoose.model('Reactions', Reactions);