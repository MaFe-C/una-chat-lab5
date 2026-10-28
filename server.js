
// npm install para descargar los paquetes...

// libreriuas
var validation = require('./libs/unalib');
var express = require('express');
var port = process.env.PORT || 3000;

// crea la app, el servidor http y socket.io (separado de listen para poder probarlo)
function createApp() {
  var app = express();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);

  // root: presentar html
  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

  // escuchar una conexion por socket
  io.on('connection', function(socket){
    // si se escucha "chat message"
    socket.on('Evento-Mensaje-Server', function(msg){

      msg =  validation.validateMessage(msg);
      // volvemos a emitir el mensaje validado
      io.emit('Evento-Mensaje-Server', msg);
    });
  });

  return { app: app, http: http, io: io };
}

module.exports = createApp;

if (require.main === module) {
  createApp().http.listen(port, function(){
    console.log('listening on *:' + port);
  });
}
