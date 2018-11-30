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
router.post('/', auth.required, (req, res, next) => {
  const { body: { post } } = req;
  const { payload: { id } } = req;

  Users.findById(id).then( (user) => {
  	if(!user) {
        return res.sendStatus(400);
      }

	// form validation
	if(!post.media){
		return res.status(422).json({
	      errors: {
	        media: 'is required',
	      },
	    });
	}

	if(!post.description){
	    return res.status(422).json({
	      errors: {
	        content: 'is required',
	      },
	    });
	}

	// creating a new post
	const pst = new Posts(post);
	pst.save().then(() => {
		res.status(201).json({message: "Post successfully created."});
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


// reactions: add reaction on posts
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
				post_id: mongoose.Types.ObjectId(reaction.postId),
				user_id: user.id,
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


// reactions: remove reaction on post 
router.post("/unreact", auth.required, (req, res, next) => {
	const { body: { postId }} = req;
	const { payload: { id }} = req;

	Users.findById(id).then((user) => {
		if(!user) {
			res.sendStatus(400);
		}

		if(!postId) {
			return res.status(422).json({
			      errors: {
			        postId: 'is required',
			      },
		    	});
		}

		postId = mongoose.Types.ObjectId(postId.id);

		Posts.findOne({"_id": postId}).then((post) => {
			var reactionIndex = -1;

			reactions = post.reactions;
			for(i=0;i<reactions.length;i++){
				if(reactions[i].postId == postId.id){
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