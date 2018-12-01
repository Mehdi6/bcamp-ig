const mongoose = require('mongoose');
require('../../models/Posts');
require('../../models/Users');
require('../../models/Comments');
require('../../models/Reactions');

router = require("express").Router();
auth = require("../auth");
Posts = mongoose.model("Posts");
Users = mongoose.model('Users');
Reactions = mongoose.model('Reactions');
Comments = mongoose.model('Comments');

//add comment on post
router.post('/', auth.required, (req, res, next) => {
	const { body: { comment } } = req;
	const { payload: { id } } = req;

	Users.findById(id).then((user) => {
		if(!user) {
			return res.sendStatus(400);
		}
		
		if(!comment.content) {
			return res.status(422).json({
			      errors: {
			        content: 'is required',
			      },
		    	});
		}

		if(!comment.postId) {
			return res.status(422).json({
			      errors: {
			        postId: 'is required',
			      },
		    	});
		}

		// creating a new comment
		var cmnt = new Comments();

		cmnt.post_id = comment.postId;
		cmnt.content = comment.content;
		cmnt.created_at = Date();

		cmnt.save().then(() => {
			return res.status(201).json({message: "comment successfully created"});
			});
		});
});


// remove comment from post 
router.delete('/', auth.required, (req, res, next) => {
	const { body: { commentId } } = req;
	const { payload: { id } } = req;

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


// edit comment 
router.put('/', auth.required, (req, res, next) => {
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


// create reply on comment
router.post("/reply", auth.required, (req, res, next) => {
  const { body: { reply }} = req;
  const { payload: { id }} = req;

  Users.findById(id).then((user) => {
    if(!user) {
      res.sendStatus(400);
    }
    
    Comments.findById(reply.parentCommentId).then( (cmnt) => {
    	if(!cmnt){
    		console.log(cmnt);
    		return res.status(400).json({parentCommentId:"required, to be valid."});
    	}

	    rply = Comments();
	    rply.content = reply.content;
	    rply.parent_comment_id = reply.parentCommentId;
	    reply.post_id = cmnt.post_id;
	    rply.created_at = Date();

        rply.save().then( () => {	
      		return res.status(200).json({"message": "Reply on reaction successfully"});
		});
    });
  });
});


// reactions: add reaction on comments
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

		if(!reaction.commentId) {
			return res.status(422).json({
			      errors: {
			        commentId: 'is required',
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

		commentId = mongoose.Types.ObjectId(reaction.commentId);

		Comments.findOne({"_id": commentId}).then((comment) => {
			const reactionObject = new Reactions({
				comment_id: mongoose.Types.ObjectId(reaction.commentId),
				user_id: user.id,
				type: reaction.type,
				created_at: Date()
			});

			var reactionIndex = -1;
			reactions = comment.reactions;

			// check weather user already reacated to this comment/reply
			for(i=0;i<reactions.length;i++) {
				if(reactions[i].user_id == id){
					reactionIndex = i;
					break;
				}
			}

			if(reactionIndex >= 0){
				return res.status(200).json({"message": "user already reacted to this comment."});
			}
			
			comment.reactions.push(reactionObject);
			comment.save().then(() => {
				return res.status(200).json({"message": "reaction added successfully"});
			})
		});
	});
});

// reactions: remove reaction on post
router.post("/unreact", auth.required, (req, res, next) => {
	const { body: { commentId }} = req;
	const { payload: { id }} = req;

	Users.findById(id).then((user) => {
		if(!user) {
			res.sendStatus(400);
		}

		if(!commentId) {
			return res.status(422).json({
			      errors: {
			        commentId: 'is required',
			      },
		    	});
		}

		Comments.findById(commentId.id).then((comment) => {
			var reactionIndex = -1;

			reactions = comment.reactions;
			for(i=0;i<reactions.length;i++) {
				if(reactions[i].user_id == mongoose.Types.ObjectId(id)){
					reactionIndex = i;
					break;
				}
			}

			console.log(comment.reactions);

			if(reactionIndex < 0) {
				return res.status(400).json({"message": "The user reaction does not exist."});
			}

			reactions.splice(reactionIndex, 1);

			comment.save().then(() => {
				return res.status(200).json({"message": "reaction removed successfully"});
			});
		});
	});

;})


module.exports = router;