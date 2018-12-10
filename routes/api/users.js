const mongoose = require('mongoose');
require('../../models/Posts');
require('../../models/Users');
require('../../models/Comments');

const router = require('express').Router();
const Users = mongoose.model('Users');
const auth = require('../auth');
const errorHandler = require('errorhandler');

//POST new user route (optional, everyone has access)
router.post('/signup', auth.optional, (req, res, next) => {
  const { body: { user} } = req;

  const passwordValidator = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
  const emailValidator = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  // email validation

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }
  else {
    if(!user.email.match(emailValidator)){
      res.status(422).json({
        errors:{
          email: "Please enter a valid email."
        }
      })
    };
  }

  // Username validation
  if(!user.username) {
    return res.status(422).json({
      errors: {
        username: 'is required',
      }
    });
  } else {
    if(user.username.length < 5)
      res.status(422).json({
        errors:{
          username: "username too short: length less than 5 chars."
        },
      });

    if(user.username.length > 30)
      res.status(422).json({
        errors:{
          username: "username too long: length less than 30 chars."
        },
      });
  }

  // Fullname validation
  if(!user.fullname) {
    return res.status(422).json({
      errors: {
        fullname: 'is required'
      },
    });
  }
  else {
    if(user.fullname.length < 5){
      return res.status(422).json({
        fullname: "length constraints: number of chars less than 5."
      });
    }

    if(user.fullname.length > 100){
      return res.status(422).json({
        fullname: "length constraints: number of chars higher than 100."
      });
    }
  }
  
  // Password validation
  if(!user.password1) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  if(!user.password2) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  if(user.password1 != user.password2){
    return res.status(422).json({
      errors:{
        password: "passwords  do not match"
      },
    });
  }

  if(!user.password1.match(passwordValidator)){
    return res.status(422).json({
      erros:{
        password: 'Password validation error: the password must contain at least 1 capital letter, at least 1 lower case letter, at least 1 digit and more than 8 chars.'
      },
    });
  }

  // User bio' validation
  
  if('bio' in user) {
    if(user.bio.length > 300)
      res.status(422).json({
        bio: "The bio's length exceeds 300 chars, try making it briefer please :)" 
      });
    
    if(user.bio.length < 10) {
      res.status(422).json({
        errors:{
          bio: "the bio's length is shorter than 10 chars, please make it longer." 
        }
      });
    }
  }

  // TODO: integrate other fields: fullname, username, etc
  const finalUser = new Users(user);
  finalUser.setPassword(user.password1);

  finalUser.following = [];
  finalUser.followers = [];

  //  TODO: before saving, send validation email

  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

//POST  route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;
  
  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  Users.findOne({'email': user.email }, "hash salt password", function(err, usr) {
    if(err) console.log(errorHandler(err));
    
    if(usr)
      if(usr.validatePassword(user.password)) {
        usr.token = usr.generateJWT();
        console.log('authenticate');
        return res.json({ user: usr.toAuthJSON() });
      }
      else
        console.log("report unmatched password");

    else
      console.log("report unmatched email");

  });
});

// TODO: implement Logout
// router.post('/logout', auth.required, (req, res, next) => {
//   const { payload: {id} } = req;

//   Users.findById(id).then( (user) => {
//     if(!user) {
//       res.sendStatus(400);
//     }

//   });

// });


// TODO: implement get user profile
router.get("/profile", auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  Users.findById(id, "followers following fullname username bio").then( (user) => {
    if(!user) {
      res.sendStatus(400).json({"message": "non-existant user account."});
    }

    followers_count = user.followers.length;
    following_count = user.following.length;

    user_profile = { 
      username: user.username,
      fullname: user.fullname,
      followers_count: user.followers.length,
      following_count: user.follpwing.length,
      bio: user.bio
            }

    console.log(user_profile);

    return res.status(200).json(use_data);
  });
});

// TODO: implement email validation
// TODO: implement reset password


router.post('/follow', auth.required, (req, res, next) => {
  const { body: { userToFollow }} = req;
  const { payload: { id } } = req;

  Users.findById(id).then( (user) => {
    if(!user) {
      res.sendStatus(400);
    }

    // checking if an account associated to the user to follow does exist
    Users.findById(userToFollow.userId).then( (usr) => {
      if(!usr) {
        return res.status(400).json({
          errors: {
            userToFollow: "the provided id is not associated to any user account!"
          },
        });
      }
      usr.followers.push(id);
      usr.save();
    });

    user.following.push(userToFollow.userId);
    user.save().then(() => {
      return res.status(200).json({"message": "following user successfully!"});
    })
  })
});


router.post("/unfollow", auth.required, (req, res, next) => {
  const { body: { userToUnfollow }} = req;
  const { payload: { id }} = req;

  Users.findById(id).then( (user) => {
    if(!user) {
      res.sendStatus(400);
    }

    if(!userToUnfollow){
      return res.status(422).json({
        errors: {
          userToUnfollowId: 'is required',
        },
      });
    }

    indexOfUserToUnfollow = user.following.indexOf(userToUnfollow.id);

    if( indexOfUserToUnfollow < 0){
      res.status(400).json({
        "message":"No user followed with the given id"
      });
    }

    user.following.splice(indexOfUserToUnfollow);
    user.save().then( () => {
      return res.status(200).json({'message': "user successfully unfollowed"});
    });
  });
});

// TODO: disactivate account
// router.post("/diactivate", auth.required, (res, req, next) => {
  
// });

// TODO: implement reaction to comment


// TODO: implement unreact to comment

module.exports = router;