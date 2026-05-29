import {randomBytes} from 'crypto';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';

export function generateLeadCode(): string {
  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const bytes = randomBytes(4);
  const suffix = Array.from(bytes)
    .map((byte) => alphabet[byte % alphabet.length])
    .join('');

  return `SR-${yyyy}${mm}${dd}-${suffix}`;
}
