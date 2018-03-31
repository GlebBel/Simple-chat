const Mess = require('../models/message.js');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user.js')

module.exports.addConnection = (map, socket, id) => {
  map.set(id, socket);
}

module.exports.closeConnection = (io, id) => {
  console.log(id, io.sockets.connected);
  if(io.sockets.connected[id]) io.sockets.connected[id].disconnect();
  else console.log('no connection')
}


module.exports.func = function (socket) {
      Mess.getMessList((err, data) => {
        if(err) socket.emit('err', err)
        else {
          let messList = []
          data.map((mess, index, array) => {
            User.getUserById(mess.user, (err, user)=>{
              if(err) return socket.emit('err', err);
              messList.push(createMess(user, mess));
              if(index === array.length - 1){
                console.log(messList.length)
                socket.emit('messList', messList);
              }
            })
          })
           socket.emit('messList', messList);
        }
      })
      console.log('Это мое имя из токена: ' + socket.decoded_token.userName + '. Шыфр: ' + socket.decoded_token);
      socket.decoded_token.socketId = socket.id;

      socket.emit('newToken', {token : jwt.sign(JSON.stringify(socket.decoded_token), 'key')});
      
      socket.on("clientEvent", (data) => {
        console.log(data);
      })
    

      socket.on('message', (data) => {
        //if(!req.isAuthenticated()) return socket.emit('err', {err: 'Didn\'t authorizated'});
        console.log(data.text)
        if(data.text.length > 1000) return socket.emit('err', {err: 'Massage is too long'});
        let mess = new Mess({
        	text: data.text,
          user: mongoose.Types.ObjectId(socket.decoded_token._id),
        })
        Mess.addMess(mess, (err) => {
          if(err) return console.log(err);
          else console.log(createMess(socket.decoded_token, mess))
          socket.broadcast.emit('messList', [createMess(socket.decoded_token, mess)]);
        })
      })

      socket.on('disconnect', () =>{
        console.log('disc')
      })

}
const createMess = (user, mess) => {
  return {
    name: user.userName,
    photo: user.photoUrl,
    time: mess.date,
    text: mess.text,
    _id: mess._id
  }

}