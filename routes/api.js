const express = require('express');
const passport = require('../config/passport.js')
const router = express.Router();
const User = require('../models/user.js');

router.route('/userExist')
	.post((req,res) => {
		User.getUserByUserName(req.body.data, (err, user)=>{
			if(user) res.send({exist:true});
			else res.send({exist:false});
		})
})

router.route('/newUser')
	.post((req, res) => {
		chackForm(req.body.userName, req.body.password , (err) =>{
			if(err){ res.send({err: err})}
			else{
				User.getUserByUserName(req.body.userName, (err, user) =>{
					if(user) res.send({err: 'This username in already engaged'})
					user = new User({
						userName: req.body.userName,
						password: req.body.password,
					})
					User.createUser(user, (err) =>{
						if(err) res.send(err);
						res.send('ok')
					})
				})
			}	
		})
	});


router.post('/login', (req, res, next) => {
  console.log('auth', req.isAuthenticated());
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send('/login')} 
    else{req.logIn(user, function(err) {
      if (err) { console.log(err); }
      return res.send('ok')
    })};
  })(req, res, next);
});

router.get('/authenticated', (req, res) => {
	res.send(req.isAuthenticated());
})

router.post('/getUserInfo', (req, res) => {
	if(!req.body.username) res.send('err');
	else{
		User.getUserByUserName(req.body.username, (err, user) => {
			if(err) res.send({err: err});
			if(!user){res.send({err:'no users'})}
			else res.send({name: user.userName, pass: user.password});
		})
	}
})
router.post('/getAuthorizedUserInfo', (req, res) => {
	if(req.isAuthenticated()) res.send('err')
	else res.send({name: req.user.userName, pass: req.user.password});
})

router.route('/userInfo/:username')
	.get((req, res) => {
		User.getUserByUserName(req.params.username, (err, user) => {
			res.send(user);
		})
	})
router.route('/userInfo/:username/:param')
	.post((req, res, next) => {
		console.log(!req.user,'here');
		if(!req.user) {res.send({err: 'err'})}
		else{
			User.getUserByUserName(req.params.username, (err, user) => {
				if(!user){ res.send({err: 'err'})}
				else if(user.userName !== req.user.userName){res.send({err: 'err'})}
				else if(req.params.param in user){
				    console.log(req.body);
					User.changeUserInfo(req.user.id, req.params.param, req.body.data, (err, user, color) => {
						if(err) res.send({err:err});
						else if(user) res.send(user[req.params.param]);
						else res.send('---');
					})
				}
			})
		}
	})

const chackForm = (userName, password, callback) => {
	if(!userName || userName.length < 6) callback('wrong username');
	else if(!password && password.length < 6) callback('wrong password');
	callback();
}
module.exports = router;