import { useCallback, useEffect, useRef, useState } from 'react';
import type { WorkerOutgoingMessage } from '../../app/bot/types.js';

interface BotEvent {
	botId: number;
	event: WorkerOutgoingMessage;
}

export function useWebSocket(botId: number) {
	const [connected, setConnected] = useState(false);
	const [events, setEvents] = useState<WorkerOutgoingMessage[]>([]);
	const wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
		wsRef.current = ws;

		ws.onopen = () => setConnected(true);
		ws.onclose = () => setConnected(false);

		ws.onmessage = (message) => {
			const data: BotEvent = JSON.parse(message.data);
			if (data.botId === botId) {
				setEvents((prev) => [...prev, data.event]);
			}
		};

		return () => {
			ws.close();
		};
	}, [botId]);

	const clearEvents = useCallback(() => setEvents([]), []);

	return { connected, events, clearEvents };
}
