export const PORT = Number(process.env.PORT) || 4444;
export const HOST = process.env.HOST || "0.0.0.0";

/** Idle room cleanup timeout in milliseconds (default 1 hour). */
export const ROOM_IDLE_TIMEOUT = Number(process.env.ROOM_IDLE_TIMEOUT) || 60 * 60 * 1000;
