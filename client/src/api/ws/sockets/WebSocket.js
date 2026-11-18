import socketIoClient from 'socket.io-client';
import CONSTANTS from '../../../constants';

class WebSocket {
  constructor (dispatch, getState, room) {
    this.dispatch = dispatch;
    this.getState = getState;
    this.room = room;
    
    // Для WebSocket используем localhost:5001, так как браузер подключается снаружи Docker
    const wsUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5001/${room}`
      : `${CONSTANTS.BASE_URL}${room}`;
    
    this.socket = socketIoClient(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 10000,
      autoConnect: true,
    });
    this.listen();
  }

  listen = () => {
    this.socket.on('connect', () => {
      console.log(`[WebSocket] Connected to ${this.room}`);
      this.anotherSubscribes();
    });

    this.socket.on('connect_error', (error) => {
      console.warn(`[WebSocket] Connection error for ${this.room}:`, error.message);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`[WebSocket] Reconnected to ${this.room} after ${attemptNumber} attempts`);
      this.anotherSubscribes();
    });

    this.socket.on('reconnect_error', (error) => {
      console.warn(`[WebSocket] Reconnection error for ${this.room}:`, error.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`[WebSocket] Disconnected from ${this.room}: ${reason}`);
    });
  };

  anotherSubscribes = () => {};
}

export default WebSocket;
