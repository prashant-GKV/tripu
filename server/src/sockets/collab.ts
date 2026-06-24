import type { Server as HttpServer } from 'node:http';
import { Server as IOServer, type Socket } from 'socket.io';
import { config } from '../config.js';

/**
 * Realtime collaboration hub (Socket.io). One room per trip — clients pass the
 * `tripId` (and optionally `userId`/`displayName`) in the handshake query.
 *
 * Events:
 *   in:  activity:update { activityId, patch }  → broadcast to room
 *        cursor          { ... }                → broadcast to room
 *        presence        { ... }                → broadcast to room
 *   out: presence:list   { users: PresenceUser[] }   (on join/leave)
 *        activity:update / cursor / presence (relayed)
 *
 * The io instance is stored module-level so REST handlers (trips.ts PATCH) can
 * push updates via `broadcastActivityUpdate` without holding the instance.
 */

interface PresenceUser {
  socketId: string;
  userId: string;
  displayName: string;
}

let io: IOServer | null = null;

function roomFor(tripId: string): string {
  return `trip:${tripId}`;
}

function presenceList(server: IOServer, tripId: string): PresenceUser[] {
  const room = server.sockets.adapter.rooms.get(roomFor(tripId));
  if (!room) return [];
  const users: PresenceUser[] = [];
  for (const sid of room) {
    const s = server.sockets.sockets.get(sid);
    if (!s) continue;
    const d = s.data as { userId?: string; displayName?: string };
    users.push({
      socketId: sid,
      userId: d.userId ?? 'anon',
      displayName: d.displayName ?? 'Guest',
    });
  }
  return users;
}

function emitPresence(server: IOServer, tripId: string): void {
  server.to(roomFor(tripId)).emit('presence:list', { tripId, users: presenceList(server, tripId) });
}

export function initCollab(server: HttpServer): () => Promise<void> {
  io = new IOServer(server, {
    cors: { origin: config.CLIENT_ORIGIN, credentials: true },
  });

  io.on('connection', (socket: Socket) => {
    const q = socket.handshake.query;
    const tripId = typeof q.tripId === 'string' ? q.tripId : undefined;
    const userId = typeof q.userId === 'string' ? q.userId : 'anon';
    const displayName = typeof q.displayName === 'string' ? q.displayName : 'Guest';

    socket.data.userId = userId;
    socket.data.displayName = displayName;
    socket.data.tripId = tripId;

    if (tripId) {
      void socket.join(roomFor(tripId));
      if (io) emitPresence(io, tripId);
    }

    // Allow explicit join (client may connect first, choose trip later).
    socket.on('join', (payload: { tripId?: string } = {}) => {
      const tid = payload.tripId;
      if (!tid) return;
      socket.data.tripId = tid;
      void socket.join(roomFor(tid));
      if (io) emitPresence(io, tid);
    });

    socket.on('activity:update', (payload: unknown) => {
      const tid = (socket.data.tripId as string | undefined) ?? tripId;
      if (!tid) return;
      socket.to(roomFor(tid)).emit('activity:update', payload);
    });

    socket.on('cursor', (payload: unknown) => {
      const tid = (socket.data.tripId as string | undefined) ?? tripId;
      if (!tid) return;
      socket.to(roomFor(tid)).emit('cursor', { from: socket.id, ...(asObject(payload)) });
    });

    socket.on('presence', (payload: unknown) => {
      const tid = (socket.data.tripId as string | undefined) ?? tripId;
      if (!tid) return;
      socket.to(roomFor(tid)).emit('presence', { from: socket.id, ...(asObject(payload)) });
    });

    socket.on('disconnect', () => {
      const tid = socket.data.tripId as string | undefined;
      if (tid && io) emitPresence(io, tid);
    });
  });

  return async () => {
    if (io) {
      await io.close();
      io = null;
    }
  };
}

function asObject(payload: unknown): Record<string, unknown> {
  return payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
}

/**
 * Push an activity update into a trip room from outside the socket layer (e.g.
 * the REST PATCH handler). No-op if the hub isn't initialised.
 */
export function broadcastActivityUpdate(tripId: string, payload: unknown): void {
  if (!io) return;
  io.to(roomFor(tripId)).emit('activity:update', payload);
}
