'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface LiveMatchUpdate {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeOdds: number;
  drawOdds?: number;
  awayOdds: number;
  league: string;
  sport: string;
  minute: number;
}

export function useLiveUpdates() {
  const [liveUpdates, setLiveUpdates] = useState<LiveMatchUpdate[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('/?XTransformPort=3003', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('live:update', (data: { matches: LiveMatchUpdate[] }) => {
      setLiveUpdates(data.matches);
    });

    socketRef.current = newSocket;

    return () => {
      newSocket.close();
    };
  }, []);

  const reconnect = useCallback(() => {
    socketRef.current?.connect();
  }, []);

  return { liveUpdates, connected, reconnect };
}
