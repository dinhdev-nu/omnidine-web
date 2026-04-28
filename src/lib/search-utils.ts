const VIETNAMESE_D_RE = /[đĐ]/g;
const COMBINING_MARKS_RE = /[\u0300-\u036f]/g;
const NON_ALPHANUMERIC_RE = /[^\p{L}\p{N}\s]/gu;
const MULTIPLE_SPACES_RE = /\s+/g;

function toSearchableText(value: string): string {
  return value
    .normalize('NFD')
    .replace(COMBINING_MARKS_RE, '')
    .replace(VIETNAMESE_D_RE, 'd')
    .replace(NON_ALPHANUMERIC_RE, ' ')
    .toLowerCase()
    .replace(MULTIPLE_SPACES_RE, ' ')
    .trim();
}

export function matchesLooseSearch(target: string, query: string): boolean {
  const normalizedQuery = toSearchableText(query);
  if (!normalizedQuery) return true;

  const normalizedTarget = toSearchableText(target);
  if (!normalizedTarget) return false;

  const tokens = normalizedQuery.split(' ');
  return tokens.every((token) => normalizedTarget.includes(token));
}

export function buildSearchTarget(...parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
