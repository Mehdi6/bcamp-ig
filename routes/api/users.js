
const mongoose = require('mongoose');
require('../../models/Posts')
require('../../models/Users')

const router = require('express').Router();
const Users = mongoose.model('Users');
const auth = require('../auth');
const errorHandler = require('errorhandler');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
  const user = { email: req.body.email, password: req.body.password };

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

  // TODO: integrate other fields: fullname, username, etc

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  //  TODO: before saving, send validation email

  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

//POST login route (optional, everyone has access)
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
      if(user.password == usr.password) {
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
// router.post('/logout', auth.required, (req, res, next)) => {
  
// });


// TODO: implement email validation


// TODO: implement reset password
  
  
module.exports = router;