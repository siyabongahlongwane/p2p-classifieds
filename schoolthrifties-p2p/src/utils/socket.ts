import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL; //  Your WebSocket server URL

//  Singleton pattern: Ensures only one WebSocket connection exists
const socket: Socket = io(SOCKET_URL, {
    // autoConnect: false, // Prevents auto-connection until explicitly needed
});

export default socket;
