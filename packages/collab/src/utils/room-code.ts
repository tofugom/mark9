import { customAlphabet } from "nanoid";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const CODE_LENGTH = 6;

const generate = customAlphabet(ALPHABET, CODE_LENGTH);

/** Generate a random 6-character room code (lowercase alphanumeric). */
export function generateRoomCode(): string {
  return generate();
}
