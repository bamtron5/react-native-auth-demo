const app = require('./../main');
const PORT = process.env.PORT || 8080;
const http = require('http');
const server = http.createServer(app);

app.set('port', PORT);

server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
    console.log(`listening on ${PORT}`);
}