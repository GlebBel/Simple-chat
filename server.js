const path = require('path')
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport.js');
const router = require('./routes/api.js')
require('dotenv').config()

const app = express();

mongoose.connect(process.env.DB_URL, ()=>console.log('m'))

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));



app.use('/public', express.static('public'));

app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());






app.use('/api', router)

app.get('*', (req, res) => {
	console.log('hi');
	res.sendFile(path.resolve(__dirname, 'public/index.html'))
});

app.listen(process.env.PORT || 5000, function(err) {
	console.log('1');
  if (err) {
    console.log(err);
    return;
  }
console.log('1');
});