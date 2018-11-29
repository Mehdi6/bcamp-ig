const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
require('../../models/Comments');

const Posts = mongoose.model('Posts');
const Users = mongoose.model('Users');
const Comments = mongoose.model('Comments');


// TODO: check data validation 
router.post('/add', auth.required, (req, res, next) => {
  const { body: { post1 } } = req;
  const { payload: { id } } = req;

  Users.findById(id).then( (user) => {
  	if(!user) {
        return res.sendStatus(400);
      }

      console.log(post1);

	// form validation
	if(!post1.media){
		return res.status(422).json({
	      errors: {
	        media: 'is required',
	      },
	    });
	}

	if(!post1.description){
	    return res.status(422).json({
	      errors: {
	        content: 'is required',
	      },
	    });
	}

	// creating a new post
	var post = new Posts(post1);
	
	post.save().then(() => {
		res.status(201).json({message: "post successfully created"});
		});
	}); 
});

// TODO: Implement remove post
router.delete('/', auth.required, (req, res, next) => {
	const { body: { postId } } = req;
	const { payload: { id }} = req;

	Users.findById(id).then((user) => {
		if(!user) {
		    return res.sendStatus(400);
	  	}
		postObjectId = mongoose.Types.ObjectId(postId.id);

		Posts.deleteOne({ "_id": postObjectId}).then(() => {
				// message of successfull deletion
				console.log("deleting the post");
				return res.status(200).json({'message': "post successfully deleted!"});
			});
		});
});

// TODO: implement add comment
router.post('/comment', auth.required, (req, res, next) => {
	const { body: { comment1 } } = req;
	const { payload: { id } } = req;


	Users.findById(id).then((user) => {
		if(!user) {
			return res.sendStatus(400);
		}

		// creating a new comment
		var comment = new Comment(comment1);
		comment.created_at = Date();
		
		comment.save().then(() => {
			res.status(201).json({message: "comment successfully created"});
			});
		});
});

// TODO: implement remove comment
router.delete('/comment', auth.required, (req, res, next) => {
	const { body: { commentId } } = req;
	const { payload: { id } } = req;

	console.log(commentId);

	Users.findById(id).then((user) => {
		if(!user) {
			return res.sendStatus(400);
		}

		commentObjectId = mongoose.Types.ObjectId(commentId.id);
		Comments.deleteOne({'_id': commentObjectId}).then(() => {
			res.status(201).json({message: "comment removed successfuly"});
			});
		});
});

module.exports = router;