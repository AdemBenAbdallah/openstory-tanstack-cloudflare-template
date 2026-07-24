export type PlaygroundResult = {
  normalizedMessage: string;
  wordCount: number;
  characterCount: number;
  receivedAt: string;
};

export function createPlaygroundResult(
  message: string,
  receivedAt = new Date().toISOString()
): PlaygroundResult {
  const normalizedMessage = message.trim().replace(/\s+/g, ' ');

  return {
    normalizedMessage,
    wordCount: normalizedMessage ? normalizedMessage.split(' ').length : 0,
    characterCount: normalizedMessage.length,
    receivedAt,
  };
}
