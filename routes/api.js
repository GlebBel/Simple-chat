const express = require('express');
const passport = require('../config/passport.js')
const router = express.Router();
const User = require('../models/user.js');
const fs = require('fs');
//const upload = require('../server.js');

const multer  = require('multer');
/*const storage = multer.diskStorage({
      destination: './public/data/',
      filename: 'ths.jpg'
});*/
const upload = multer({ dest: 'upload/'});

//const formidable = require('formidable');

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
      if(err)return sendRes(res, err);
    })
    	return res.json({user: user.userName})
	};
  })(req, res, next);
})

router.get('/logout', (req, res) => {
	req.logout();
	console.log('logout')
	res.json({user: null});
})

router.get('/authenticated', (req, res) => {
	console.log('hello',req.user)
	if(req.user) res.json({user: req.user.userName});
	else res.json({user: null})
})

router.post('/getUserInfo', (req, res) => {
	if(!req.body.username)return sendRes(res, 'err2');
	User.getUserByUserName(req.body.username, (err, user) => {
		if(err)return sendRes(res, err);
		if(!user)return sendRes(res, 'err3');
		console.log(user)
		const userInfo = {
			name: user.userName,
			about: user.about,
			status: user.status,
			photoUrl: user.photoUrl,
		}
		res.json(userInfo);
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
			console.log(user)
			const userInfo = {
				userName: user.userName,
				about: user.about,
				status: user.status,
				photoUrl: user.photoUrl,
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


router.post('/setPhoto', upload.single('photo'), (req, res)=>{
	console.log('photo');
	console.log(req.body);
	console.log(req.file);
	if(!req.user) return sendRes(res, 'err');
	const dirPath = '/public/data/usersPhotos/' + req.user._id;
	const photoPath =  dirPath + '/' + new Date + '.jpg';
	if(fs.existsSync('.'+dirPath)){
		fs.unlink('.'+req.user.photoUrl, (err) => {
			if(err) return sendRes(res, err);
			fs.rename(req.file.path, '.' + dirPath + '/' + new Date + '.jpg', (err) => {
				console.log(req.file.path, '.' + dirPath + '/up.jpg')
				if(err) return sendRes(res, err)
				else User.changeUserInfo(req.user.id, 'photoUrl', photoPath, (err) =>{
					if(err) return sendRes(res, err);
					sendRes(res, null, photoPath);
				})
			})
		})
	}
	else{
		fs.mkdir('.' + dirPath, (err) => {
			if(err) sendRes(res, err);
			fs.rename(req.file.path, '.' + dirPath + '/' + new Date + '.jpg',(err) => {
				if(err) return sendRes(res, err);
				else User.changeUserInfo(req.user.id, 'photoUrl', photoPath , (err) =>{
					if(err) return sendRes(res, err);
					return sendRes(res, null, photoPath);
				})
			})
		})
	}
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