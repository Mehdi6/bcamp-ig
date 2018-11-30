const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
require('../../models/Comments');
require('../../models/Reactions');

const Posts = mongoose.model('Posts');
const Users = mongoose.model('Users');
const Comments = mongoose.model('Comments');
const Reactions = mongoose.model('Reactions');


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


router.post('/comment', auth.required, (req, res, next) => {
	const { body: { comment1 } } = req;
	const { payload: { id } } = req;

	console.log(comment1.content);

	Users.findById(id).then((user) => {
		if(!user) {
			return res.sendStatus(400);
		}
		
		if(!comment1.content) {
			return res.status(422).json({
			      errors: {
			        content: 'is required',
			      },
		    	});
		}

		// creating a new comment
		var comment = new Comments(comment1);
		comment.created_at = Date();
		
		comment.save().then(() => {
			res.status(201).json({message: "comment successfully created"});
			});
		});
});


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


router.put('/comment', auth.required, (req, res, next) => {
	const { body: { comment } } = req;
	const { payload: { id } } = req;

	Users.findById(id).then((user) => {
		if(!user) {
			return res.sendStatus(400);
		}

		Comments.update({_id: comment.id}, {"content": comment.content}).then(() => {
			return res.status(201).json({message: "comment updated successfuly"});
			});
		});
	});


// reactions: on posts
router.post('/react', auth.required, (req, res, next) => {
	const { body: { reaction }} = req;
	const { payload: {id}} = req;

	Users.findById(id).then((user) => {
		if(!user) {
			res.sendStatus(400);
		}

		if(!reaction) {
			return res.status(422).json({
			      errors: {
			        reaction: 'is required',
			      },
		    	});
		}

		if(!reaction.postId){
			return res.status(422).json({
			      errors: {
			        postId: 'is required',
			      },
		    	});
		}

		if(!reaction.type) {
			return res.status(422).json({
			      errors: {
			        type: 'is required',
			      },
		    	});
		}

		postId = mongoose.Types.ObjectId(reaction.postId);

		Posts.findOne({"_id": postId}).then((post) => {
			const reactionObject = new Reactions({
				postId: mongoose.Types.ObjectId(reaction.postId),
				userId: user.id,
				type: reaction.type,
				created_at: Date()
			});
			
			post.reactions.push(reactionObject);
			post.save().then(() => {
				return res.status(200).json({"message": "reaction added successfully"});

			})
		});

		});
});

// reactions: on comments
router.post("/unreact", auth.required, (req, res, next) => {
	const { body: { reaction }} = req;
	const { payload: { id }} = req;

	Users.findById(id).then((user) => {
		if(!user) {
			res.sendStatus(400);
		}

		if(!reaction) {
			return res.status(422).json({
			      errors: {
			        reaction: 'is required',
			      },
		    	});
		}

		postId = mongoose.Types.ObjectId(reaction.postId);

		Posts.findOne({"_id": postId}).then((post) => {
			var reactionIndex = -1;

			reactions = post.reactions;
			for(i=0;i<reactions.length;i++){
				if(reactions[i]._id == reaction.id){
					reactionIndex = i;
					break;
				}
			}

			if(reactionIndex < 0) {
				return res.status(400).json({"message": "The user reaction does not exist."});
			}

			reactions.splice(reactionIndex, 1);

			post.save().then(() => {
				return res.status(200).json({"message": "reaction removed successfully"});
			});
		});
	});

;})



module.exports = router;