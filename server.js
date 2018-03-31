const path = require('path')
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport.js');
const router = require('./routes/api.js');
const chat = require('./routes/chat.js');
const socketioJwt = require('socketio-jwt'); // аутентификация по JWT для socket.io



require('dotenv').config()

const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server);


mongoose.connect(process.env.DB_URL, ()=>console.log('Connect to MongoDb'))
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

let connections = new Map;

const addConnection = (map, socket, id) => {
  map.set(id, socket);
}

const closeConnection = (io, id) => {
  io.sockets.connected[id].disconnect()
}

io.on('connection', socketioJwt.authorize({
    secret: 'key',
    timeout: 15000
  })
).on('authenticated', chat.func);



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
module.exports.io = io;