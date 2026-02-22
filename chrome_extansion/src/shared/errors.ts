export class InsufficientCreditsError extends Error {
  constructor() {
    super('Insufficient credits');
    this.name = 'InsufficientCreditsError';
  }
}

export function isInsufficientCreditsError(error: unknown): boolean {
  if (error instanceof InsufficientCreditsError) return true;
  if (error instanceof Error) {
    return error.message.toLowerCase().includes('insufficient credits');
  }
  return false;
}
