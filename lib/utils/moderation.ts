const BLOCKED_WORDS = [
  "spam", "scam", "hate", "violent", "harassment",
];

export function moderateContent(text: string): { passed: boolean; flaggedWords: string[] } {
  const lower = text.toLowerCase();
  const flaggedWords = BLOCKED_WORDS.filter((word) => lower.includes(word));
  return {
    passed: flaggedWords.length === 0,
    flaggedWords,
  };
}

export function containsPersonalName(text: string, names: string[]): boolean {
  const lower = text.toLowerCase();
  return names.some((name) => lower.includes(name.toLowerCase()));
}
