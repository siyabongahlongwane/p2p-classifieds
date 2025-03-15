import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001'; //  Your WebSocket server URL

//  Singleton pattern: Ensures only one WebSocket connection exists
const socket: Socket = io(SOCKET_URL, {
    // autoConnect: false, // Prevents auto-connection until explicitly needed
});

export default socket;
