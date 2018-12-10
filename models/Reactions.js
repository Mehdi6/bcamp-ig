mongoose = require("mongoose");
const Schema = mongoose.Schema;

Reactions = Schema({
	post_id: mongoose.Types.ObjectId,
	user_id: String,
	type: String,
	created_at: Date
});

mongoose.model('Reactions', Reactions);