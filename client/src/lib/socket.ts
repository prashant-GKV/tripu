import { io, type Socket } from 'socket.io-client';
import { apiBaseUrl } from './api';

/**
 * Create a Socket.io connection for a trip collaboration room.
 * OWNER of usage: collaboration UI. Reuses the API base URL.
 */
export function createTripSocket(tripId: string): Socket {
  return io(apiBaseUrl, {
    transports: ['websocket'],
    query: { tripId },
    autoConnect: true,
  });
}
