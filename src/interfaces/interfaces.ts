/**
 * eventId: user, assistant, thinking Input ID
 * content: user Input, Interrupt error메시지
 * role: user, assistant, thinking
 * data: SSE data
 */
export interface SSEMessage{
	eventId: string;
	stream_status: boolean;
    content: string;
	role?: string;
	data: Record<string, string>;
}