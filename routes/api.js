const express = require('express');
const passport = require('../config/passport.js')
const router = express.Router();
const User = require('../models/user.js');
const fs = require('fs');
const jwt = require('jsonwebtoken');
//const upload = require('../server.js');
const io = require('../server.js');
const chat = require('./chat.js')
const multer  = require('multer');
const upload = multer({ dest: 'upload/'});


router.use('*', (req,res,next) =>{

	passport.authenticate('jwt', function (err, user){
		if(user){
			req.user = user;
		}
		console.log(req.user)
		next()
	})(req, res, next) 
});

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



router.get('/logout', (req, res) => {
	jwt.verify(req.get('authorization').slice(7), 'key', (err, data) => {
		if(err) return sendRes(res, err);
		chat.closeConnection(io.io, data.socketId);
		sendRes(res, null, 'ok');
	});
	//chat.closeConnection(io,)
})

router.post('/jwt', (req, res, next) => {
	console.log(req.body.userName)
	  User.getUserByUserName(req.body.userName, (err, user) => {

	      if (err) {
	        return res.send(err);
	      }
	      if (user){console.log(user.password, req.body.password)
	      User.comparePasswords(req.body.password, user.password, function(err, isMatch){
		    if (isMatch) {
		    	const clone = {randInfo: new Date()}; 
				Object.assign(clone, user._doc);
				console.log(clone, clone.randInfo);
		        const token = jwt.sign(JSON.stringify(clone), 'key');
		        res.json({message: "ok", token: token, user: user.userName});
		    } else {
		        res.send('err');
		    }
	    })}else{res.send("No User")}
	})
})


router.get('/authenticated',(req, res) => {
	// console.log('hello',req.user)
	// if(req.user) res.json({user: req.user.userName});
	// else res.json({user: null})
	console.log('hello', req.user)
	res.send(req.user)
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
	res.send({name: req.user});
})

router.route('/userInfo/:username')
	.get((req, res, next) => {
		console.log('UI')
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

router.post('/userInfo/:username/:param', (req, res, next) => {
		console.log('---', req.body)
		if(!req.user)return sendRes(res, 'err6');
		User.getUserByUserName(req.params.username, (err, user) => {
			if(err) return sendRes(res, err);
			if(!user)return sendRes(res, 'err7');
			if(user.userName !== req.user.userName )return sendRes(res, 'err8');
			if(!(req.params.param in user) && user.userName === 'password', user.userName === 'data')return sendRes(res, 'err9');
			User.changeUserInfo(req.user.id, req.params.param, req.body.info, (err, user, color) => {
				if(err)return sendRes(res, err);
				user[req.params.param] = req.body.info;
				jwt.sign(JSON.stringify(user), 'key')
				res.send(user[req.params.param]);
			})
		})
	}
)



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
					req.user.photoUrl = photoPath;
					return sendRes(res, null, jwt.sign(JSON.stringify(req.user), 'key'));
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
					req.user.photoUrl = photoPath;
					return sendRes(res, null, jwt.sign(JSON.stringify(req.user), 'key'));
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