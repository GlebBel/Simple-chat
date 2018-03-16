const express = require('express');
const passport = require('../config/passport.js')
const router = express.Router();
const User = require('../models/user.js');

router.route('/userExist')
	.post((req,res) => {
		User.getUserByUserName(req.body.data, (err, user)=>{
			if(err)return sendRes(res, err);
			if(user) res.send({exist:true});
			else res.send({exist:false});
		})
})

router.route('/newUser')
	.post((req, res) => {
		chackForm(req.body.userName, req.body.password , (err) =>{
			if(err)return sendRes(res, err);
			User.getUserByUserName(req.body.userName, (err, user) =>{
				if(user)return sendRes(res, 'err1', {err: 'This username in already engaged'})
				user = new User({
					userName: req.body.userName,
					password: req.body.password,
				})
				User.createUser(user, (err) =>{
					if(err) res.send(err);
					res.send('ok')
				})
			})	
		})
	});


router.post('/login', (req, res, next) => {
  console.log('auth', req.isAuthenticated());
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.send({err: err}); }
    if (!user) { return res.send('/login')} 
    else{req.logIn(user, function(err) {
      return res.send('ok')
    })};
  })(req, res, next);
});

router.get('/authenticated', (req, res) => {
	res.send(req.isAuthenticated());
})

router.post('/getUserInfo', (req, res) => {
	if(!req.body.username)return sendRes(res, 'err2');
	User.getUserByUserName(req.body.username, (err, user) => {
		if(err)return sendRes(res, err);
		if(!user)return sendRes(res, 'err3');
		const userInfo = {
			name: user.userName,
			about: user.about,
			status: user.status,

		}
		res.send(userInfo);
	})
})
router.post('/getAuthorizedUserInfo', (req, res) => {
	if(req.isAuthenticated()) res.send('err4')
	else res.send({name: req.user.userName, pass: req.user.password});
})

router.route('/userInfo/:username')
	.get((req, res, next) => {
		User.getUserByUserName(req.params.username, (err, user) => {
		if(err)return sendRes(res, err);
		if(!user)return sendRes(res, 'err5');
		const userInfo = {
			userName: user.userName,
			about: user.about,
			status: user.status,

		}
		res.send(userInfo);
	})
	})
router.route('/userInfo/:username/:param')
	.post((req, res, next) => {
		if(!req.user)return sendRes(res, 'err6');
		User.getUserByUserName(req.params.username, (err, user) => {
			if(err) return sendRes(res, err);
			if(!user)return sendRes(res, 'err7');
			if(user.userName !== req.user.userName )return sendRes(res, 'err8');
			if(!(req.params.param in user) && user.userName === 'password', user.userName === 'data')return sendRes(res, 'err9');
			User.changeUserInfo(req.user.id, req.params.param, req.body.data, (err, user, color) => {
				if(err)return sendRes(res, err);
				res.send(user[req.params.param]);
			})
		})
	})

const sendRes = (res , err, data) =>{
	if(err) res.send({err: err})
	else res.send(data);
}

const chackForm = (userName, password, callback) => {
	if(!userName || userName.length < 6) callback('wrong username');
	else if(!password && password.length < 6) callback('wrong password');
	callback();
}
module.exports = router;