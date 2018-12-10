const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
require('../../models/Comments');
require('../../models/Reactions');

const Posts = mongoose.model('Posts');
const Users = mongoose.model('Users');
const Reactions = mongoose.model('Reactions');

// TODO: check data validation 
// TODO: Add length constraints to strings during validation

router.get('/list', auth.required, (req, res, next) => {
	const {payload: {id}} = req;
	Users.findById(id).then((user) => {
		if(!user){
			res.sendStatus(400);
		}
		// TODO: list of posts from all followers! build req
		// Posts.findMany(, ).then( (posts) =>{

		// });
		// test data
		pst = {
			media: 'www.placeholdres.com/144',
			description: 'test description, write a better test desc!',
			created_at: new Date()
		}
		psts = [pst, pst];
		return res.status(200).json({posts:psts});
	});
});

// choice of priate/public posts
// TODO: correct the endpoint.
router.get('/:post_id([a-f0-9]{24})', auth.required, (req, res, next) => {
	const { payload: { id }} = req;
	const post_id = req.param('post_id'); 
	
	Users.findById(id).then( (user) => {
		if(!user) {
			res.sendStatus(422);
		}

		Posts.findById(post_id).then( (post) => {
			if(!post) {
				return res.status(422).json({
					errors: {
						post_id: "post id does not match any post."
					},
				});
			}

			return res.status(200).json({
				data: post
			});
		});
	});
});

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

	// max: 1000 
	if(!post.description){
	    return res.status(422).json({
	      errors: {
	        content: 'is required',
	      },
	    });
	} else {
		// TODO: validation error status 
		if(post.description.length > 1000)
			return res.status(422).json({
				errors: {
					description: "description length exceeds 1000 chars.",
				},
			});

		else if(post.description.length < 20){
			return res.status(400).json({
			errors: {
				description: "description length is less than 60 chars.",
			},
		})
		}
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
	const listTypeReactions = ["like", "smile", "sad", "surprise"];

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
		} else {
			if(!listTypeReactions.includes(reaction.type)) {
				return res.status
			}
		}

		postId = mongoose.Types.ObjectId(reaction.postId);
		Posts.findOne({"_id": postId}).then((post) => {
			const reactionObject = new Reactions({
				post_id: mongoose.Types.ObjectId(reaction.postId),
				user_id: user.id,
				type: reaction.type,
				created_at: Date()
			});

			var reactionIndex = -1;
			reactions = post.reactions;

			// check weather user already reacted to this post
			for(i=0;i<reactions.length;i++) {
				if(reactions[i].user_id == mongoose.Types.ObjectId(id)){
					reactionIndex = i;
					break;
				}
			}

			if(reactionIndex >= 0){
				return res.status(200).json({"message": "user already reacted to this post."});
			}
			
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

		pstId = mongoose.Types.ObjectId(postId.id);

		Posts.findOne({"_id": pstId}).then((post) => {
			var reactionIndex = -1;

			reactions = post.reactions;
			for(i=0;i<reactions.length;i++){
				if(reactions[i].user_id == id){
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