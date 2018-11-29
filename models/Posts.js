mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostsSchema = new Schema({
		media: {
			type: String,
			validate: {
				validator: isUrlValid
			},
			message: props => `${props.value} is not a valid url!`,
			required: [true, 'A media attached to the Post is a required']
		},
		description: String,
		created_at: Date,
		reactions: Array
	});

function isUrlValid(urlToValidate) {
    var res = urlToValidate.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

mongoose.model('Posts', PostsSchema);