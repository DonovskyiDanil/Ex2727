const WebSocket = require('./WebSocket');
const CONSTANTS = require('../../constants');

class ChatController extends WebSocket{

  anotherSubscribes (socket) {
    this.onSubscribeChat(socket);
    this.onUnsubscribeChat(socket);
  }

  onSubscribeChat (socket) {
    socket.on('subscribeChat', (id) => {
      socket.join(id);
    });
  }

  onUnsubscribeChat (socket) {
    socket.on('unsubscribeChat', (id) => {
<<<<<<< HEAD
      socket.leave(id);
=======
      socket.join(id);
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
    });
  }

  emitNewMessage (target, message) {
    this.io.to(parseInt(target)).emit(CONSTANTS.NEW_MESSAGE,
      { message });
  }

  emitChangeBlockStatus (target, message) {
    this.io.to(parseInt(target)).emit(CONSTANTS.CHANGE_BLOCK_STATUS,
      { message });
  }
}

module.exports = ChatController;
