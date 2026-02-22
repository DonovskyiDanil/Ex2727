import socketIoClient from 'socket.io-client';
import CONSTANTS from '../../../constants';

class WebSocket {
  constructor (dispatch, getState, room) {
    this.dispatch = dispatch;
    this.getState = getState;
    // Для WebSocket используем localhost:5001, так как браузер подключается снаружи Docker
    const wsUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5001/${room}`
      : `${CONSTANTS.BASE_URL}${room}`;
    
    this.socket = socketIoClient(wsUrl, {
      origins: 'localhost:*',
    });
    this.listen();
  }

  listen = () => {
    this.socket.on('connect', () => {
      this.anotherSubscribes();
    });
  };

  anotherSubscribes = () => {};
}

export default WebSocket;
