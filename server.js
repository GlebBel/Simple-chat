const path = require('path')
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport.js');
const router = require('./routes/api.js');
const chat = require('./routes/chat.js'); // ключ для подписи JWT
//const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const socketioJwt = require('socketio-jwt'); // аутентификация по JWT для socket.io

require('dotenv').config()

const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server);


mongoose.connect(process.env.DB_URL, ()=>console.log('Connect to MongoDb'))
// mongoose.connection.on("connect", ()=>{console.log('Connect to MongoDb')})
// console.log(mongoose.connection)

const MongoStore = require("connect-mongo")(session);

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use('/public', express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

io.on('connection', socketioJwt.authorize({
    secret: 'key',
    timeout: 15000
  })
).on('authenticated', function (socket) {
  
  console.log('Это мое имя из токена: ' + socket.decoded_token.userName);
  
  socket.on("clientEvent", (data) => {
    console.log(data);
  })
});

// app.use((req,res,next) => {
//   if(!req.isAuthenticated()) next();
//   io.on('connection', chat.bind(this, req));
//   console.log('here')
//   next();
// })

app.use('/api', router)

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'public/index.html'))
});

server.listen(process.env.PORT || 5000, function(err) {
	console.log('1');
  if (err) {
    console.log(err);
    return;
  }
});