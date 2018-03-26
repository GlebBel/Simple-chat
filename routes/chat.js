const Mass = require('../models/massage.js');

module.exports = function(socket, req){ 
    console.log('connect',req.user)

    socket.on('massage', (data) => {
      //if(!req.isAuthenticated()) return socket.emit('err', {err: 'Didn\'t authorizated'});
      if(data.length > 1000) return socket.emit('err', {err: 'Massage is too long'});
      let mass = new Mass({
      	
      })

    })

    socket.on('disconnect', () =>{
      console.log('disc')
    })
};