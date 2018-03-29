var io_crypto = require('socket.io-client')('wss://ws.cex.io/ws/');

io_crypto.on('connect', function() {
	io_crypto.emit('connected');
});

export default io_crypto;